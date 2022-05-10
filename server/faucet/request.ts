import { ContractReceipt } from 'ethers'
import { ERRORS } from './errors'
import { useFweb3Faucet } from './fweb3Faucet'
import { useMaticFaucet } from './maticFaucet'
import type { IFaucetBody } from './faucet.d'

export const requestDripFromFaucet = async (
  body: IFaucetBody
): Promise<ContractReceipt> => {
  if (body.type.toLowerCase() === 'fweb3') {
    const receipt: ContractReceipt = await useFweb3Faucet(body)
    return receipt
  } else if (body.type.toLowerCase() === 'matic') {
    const receipt: ContractReceipt = await useMaticFaucet(body)
    return receipt
  } else {
    throw new Error(ERRORS.INVALID_REQUEST_PARAMS)
  }
}
