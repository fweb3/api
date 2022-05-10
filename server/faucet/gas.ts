import { ERRORS } from './errors'
import { ethers } from 'ethers'
import { IFweb3Interfaces } from '../interfaces'
import { log } from '../logger'
import fetch from 'node-fetch'

const { GAS_LIMIT = 250000000000000000, GAS_MULTIPLIER = 0.2 } = process.env

export const getGasPrices = async ({
  network,
  provider,
}: IFweb3Interfaces): Promise<number[]> => {
  try {
    log.debug('[+] Fetching gas estimate...')
    const gasRes = await _fetchGasEstimate(network)

    if (!gasRes.ok) {
      throw new Error(ERRORS.ERROR_GETTING_ESTIMATED_GAS)
    }

    const {
      fast: { maxPriorityFee: gasEstimateGwei },
    } = await gasRes.json()
    if (!gasEstimateGwei) {
      throw new Error(ERRORS.ERROR_GETTING_ESTIMATED_GAS)
    }
    const convertedEstimateInWei: number = ethers.utils
      .parseUnits(gasEstimateGwei.toFixed(5).toString(), 'gwei')
      .toNumber()

    log.debug(`[+] Gas estimate in wei: [${convertedEstimateInWei}]`)

    return _createPriceArray(convertedEstimateInWei)
  } catch (err) {
    log.debug(`[-] ${err.message}`)
    const { gasPrice } = await provider.getFeeData()
    const prices = _createPriceArray(gasPrice?.toNumber() || 0)
    return prices ?? [parseInt(GAS_LIMIT.toString())]
  }
}

const _createPriceArray = (gasEstimate: number): number[] => {
  const prices: number[] = []
  Array(4)
    .fill(gasEstimate)
    .reduce((acc, cur) => {
      if (!acc) {
        const increase = _increaseFeeByPercent(cur)
        prices.push(increase)
        return acc + increase
      }
      const increase = _increaseFeeByPercent(acc)
      prices.push(increase)
      return increase
    }, 0)
  return prices
}

const _fetchGasEstimate = async (network: string) => {
  if (network !== 'polygon') {
    return fetch('https://gasstation-mumbai.matic.today/v2')
  } else {
    return fetch('https://gasstation-mainnet.matic.network/v2')
  }
}

const _increaseFeeByPercent = (amt: number) => {
  const percent = parseFloat(GAS_MULTIPLIER.toString())
  return amt * percent + amt
}
