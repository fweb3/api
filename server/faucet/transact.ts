import { ethers } from 'ethers'
import { getGasPrices } from './gas'
import type { Provider } from './interfaces'
import { formatError } from './errors'

const { GAS_LIMIT = 200000000000 } = process.env

const _isNotValidPrice = (price: number) =>
  !price || price === 0 || price > parseInt(GAS_LIMIT.toString())

export const attemptTransaction = async (
  provider: Provider,
  contractFunction,
  address: string
) => {
  const prices = await getGasPrices(provider)
  const gasLimitGwei = ethers.utils.parseUnits(GAS_LIMIT?.toString(), 'gwei')
  console.log(`[+] Gas limit set to: [${gasLimitGwei}]`)
  for (let i = 0; i < prices.length; i++) {
    try {
      if (prices[i] === prices.length) {
        throw new Error(
          `Cannot process tx. Have tried ${prices.length} times without success.`
        )
      }

      console.log(`[+] Trying gas price [${prices[i]}]`)

      if (_isNotValidPrice(prices[i])) {
        throw new Error('Gas is unpredictable. Try again later.')
      }

      const tx = await contractFunction(address, {
        gasPrice: prices[i], // setting a gasLimit has problems
      })

      return tx.wait()
    } catch (err) {
      const formattedError = formatError(err)
      const gasReason = _isGasError(formattedError)
      if (gasReason) {
        continue
      } else {
        throw new Error(err) // formats again in the next catch
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
