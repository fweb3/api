import { ethers } from 'ethers'
import { formatError } from './errors'
import { getGasPrices } from './gas'
import type { Provider } from './interfaces'
import { log } from '../logger'

const { GAS_LIMIT = 200000000000 } = process.env

// const _isNotValidPrice = (price: number) =>
//   !price || price === 0 || price > parseInt(GAS_LIMIT.toString())

const waitFor = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const attemptTransactionWithGas = async (
  network: string,
  provider: Provider,
  faucetMethod,
  address: string
) => {
  log.debug('[+] Getting current gas prices')
  const prices = await getGasPrices(network, provider)
  log.debug(`[+] Got prices [${prices}]`)
  const gasLimitGwei = ethers.utils.parseUnits(GAS_LIMIT?.toString(), 'gwei')
  log.debug(`[+] Gas limit set to: [${gasLimitGwei}]`)

  for (let i = 0; i < prices.length; i++) {
    try {
      log.debug(`[+] Trying gas price [${prices[i]}]`)
      const tx = await faucetMethod(address)
      return tx.wait()
    } catch (err) {
      const formattedError = formatError(err)
      log.debug(JSON.stringify(formattedError))
      const isGasRelated = formattedError.type.includes('GAS')
      if (isGasRelated) {
        await waitFor(1000)
        continue
      } else {
        throw formattedError
      }
    }
  }
}
