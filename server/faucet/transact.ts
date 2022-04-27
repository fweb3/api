import { BigNumber, ethers } from 'ethers'
import fetch from 'node-fetch'
import type { Provider } from './interfaces'

const { GAS_LIMIT = 60000000000 } = process.env

export const attemptTransaction = async (
  provider: Provider,
  network: string,
  contractFunction: ethers.ContractFunction,
  address: string
) => {
  const prices: BigNumber[] = await _createPrices(provider, network)
  console.log(`[+] Gas limit set to: [${GAS_LIMIT?.toString()}]`)
  for (const price of prices) {
    try {
      console.log(`[+] Trying gas price [${price?.toString()}]`)
      const gasIsMoreThanOurLimit = price?.gt(GAS_LIMIT)
      if (!price || price.isZero()) {
        throw new Error('The gas estimated is zero.')
      }
      if (gasIsMoreThanOurLimit) {
        throw new Error('Gas costs exceed the faucets allowed maximum')
      }
      const tx: ethers.ContractTransaction = await contractFunction(address, {
        gasPrice: price, // setting a 'gasLimit' prop has problems. use price
      })
      return tx.wait()
    } catch (err) {
      console.log(err?.message)
      const gasError: boolean = _hasGasError(err)
      if (gasError) {
        continue
      } else {
        console.error(err?.message)
        throw new Error('Gas is unpredictable. Try again later.')
      }
    }
  }
}

const _buildGasUrl = (network: string) => {
  if (network === 'polygon') {
    return 'https://gasstation-mainnet.matic.network/v2'
  } else if (network === 'mumbai') {
    return 'https://gasstation-mumbai.matic.today/v2'
  } else {
    return false
  }
}

const _createPrices = async (provider: Provider, network: string) => {
  try {
    const gasUrl = _buildGasUrl(network)
    if (!gasUrl) {
      throw new Error(
        `No url to check for gas. Trying provider. ${
          network !== 'local' && '[1]'
        }`
      )
    }
    const gasRes = await fetch(gasUrl)
    const { standard } = await gasRes.json()

    if (!standard) {
      throw new Error('catch me big boy')
    }

    const { maxPriorityFee: standardFee } = standard
    const standardFeeCeil = Math.ceil(standardFee).toString()
    const standardFeeWei = ethers.utils.parseUnits(
      standardFeeCeil.toString(),
      'gwei'
    )
    const priceArr = ['3', '6', '9'].map((adder) =>
      standardFeeWei.add(parseInt(adder.padEnd(9, '0')))
    )
    return priceArr
  } catch (err) {
    const { gasPrice } = await provider.getFeeData()
    if (!gasPrice) {
      throw new Error('Error getting gas prices.')
    }
    return ['3', '6', '9', '12'].map((adder) =>
      gasPrice?.add(parseInt(adder.padEnd(9, '0')))
    )
  }
}

const _hasGasError = (err): boolean => {
  const cannotEstimate = err?.message?.includes('cannot estimate gas')
  const tooLittleGas = err?.message?.includes(
    'max fee per gas less than block base'
  )
  return cannotEstimate || tooLittleGas
}
