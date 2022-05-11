import { ERRORS, hasGasRelatedError } from '../errors/faucetErrors'
import { ethers } from 'ethers'
import { getGasPrices } from './gas'
import { IFweb3Interfaces } from '../interfaces'
import { log } from '../logger'

const { GAS_LIMIT = 200000000000 } = process.env

const waitFor = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const attemptTransactionWithGas = async (
  interfaces: IFweb3Interfaces,
  address: string,
  type: string
) => {
  const contractToCall =
    type === 'matic' ? interfaces.maticFaucet : interfaces.fweb3Faucet

  log.debug('[+] Getting current gas prices')
  const prices = await getGasPrices(interfaces)
  if (prices?.length === 0) {
    throw new Error(ERRORS.ERROR_GETTING_ESTIMATED_GAS)
  }
  log.debug(`[+] Got prices [${prices}]`)
  const gasLimitGwei = ethers.utils.parseUnits(GAS_LIMIT?.toString(), 'gwei')

  log.debug(`[+] Gas limit set to: [${gasLimitGwei}]`)
  for (let i = 0; i < prices.length; i++) {
    try {
      log.debug(`[+] Trying gas price [${prices[i]}]`)
      const tx = await contractToCall.drip(address, {
        gasPrice: prices[i],
      })
      const receipt = await tx.wait()
      log.debug({ receipt })
    } catch (err) {
      const isGasRelated = hasGasRelatedError(err)
      if (isGasRelated && i < prices.length) {
        await waitFor(500)
        continue
      } else {
        throw new Error(err)
      }
    }
  }
  throw new Error(ERRORS.EXAHUSTED_ATTEMPTS)
}
