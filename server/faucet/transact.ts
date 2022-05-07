import { ethers } from 'ethers'
import { formatError } from './errors'
import { getGasPrices } from './gas'
import type { Provider } from './interfaces'
import { log } from '../logger'

const { GAS_LIMIT = 200000000000 } = process.env

// const _isNotValidPrice = (price: number) =>
//   !price || price === 0 || price > parseInt(GAS_LIMIT.toString())

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
      if (prices[i] === prices.length) {
        throw new Error(
          `Cannot process tx. Have tried ${prices.length} times without success.`
        )
      }

      log.debug(`[+] Trying gas price [${prices[i]}]`)

      const tx = await faucetMethod(address)

      return tx.wait()
    } catch (err) {
      const formattedError = formatError(err)
      const gasReason = _isGasError(formattedError)
      if (gasReason) {
        continue
      } else {
        throw new Error(err)
      }
    }
  }
}

const _isGasError = (err: string): boolean => {
  const cannotEstimate = err.includes('cant estimate gas')
  const notEnoughGas = err.includes('not enough gas')
  const gasTooLowForNextBlock = err.includes(
    'max fee per gas less than block base'
  )
  return cannotEstimate || notEnoughGas || gasTooLowForNextBlock
}
