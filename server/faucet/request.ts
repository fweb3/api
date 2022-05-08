import { useFweb3Faucet } from './fweb3Faucet'
import { useMaticFaucet } from './maticFaucet'
import type { IFaucetBody } from './faucet.d'
import { ContractReceipt } from 'ethers'

export interface ISuccessfulDrip {
  status: string
  transaction_hash: string
  raw_receipt: ContractReceipt
}

const _handleSuccess = (receipt: ContractReceipt): ISuccessfulDrip => {
  return {
    status: 'success',
    transaction_hash: receipt.transactionHash,
    raw_receipt: receipt,
  }
}

export const requestDripFromFaucet = async (
  body: IFaucetBody
): Promise<ISuccessfulDrip> => {
  if (body.type.toLowerCase() === 'fweb3') {
    const receipt: ContractReceipt = await useFweb3Faucet(body)
    return _handleSuccess(receipt)
  } else if (body.type.toLowerCase() === 'matic') {
    const receipt: ContractReceipt = await useMaticFaucet(body)
    return _handleSuccess(receipt)
  } else {
    throw new Error('unknown faucet type')
  }
}
