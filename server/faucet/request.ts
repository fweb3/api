import { log } from './../logger'
import { ContractReceipt } from 'ethers'
import { ERRORS } from '../errors/faucetErrors'
import { useFweb3Faucet } from './fweb3Faucet'
import { useMaticFaucet } from './maticFaucet'
import type { IFaucetBody } from './faucet.d'
import { hasUsedAFaucetBefore } from './validate'

export const requestDripFromFaucet = async (
  body: IFaucetBody
): Promise<ContractReceipt> => {
  log.debug(`[+] requesting drip from faucet: ${JSON.stringify(body)}`)
  if (body.network === 'polygon') {
    const faucetNotAllowed = await hasUsedAFaucetBefore(body.account)
    log.debug({ faucetNotAllowed })
    if (faucetNotAllowed[body.type]) throw new Error(ERRORS.ALREADY_USED)
  } else if (body.type.toLowerCase() === 'fweb3') {
    log.debug('[+] Making fweb3 faucet request')
    const receipt: ContractReceipt = await useFweb3Faucet(body)
    return receipt
  } else if (body.type.toLowerCase() === 'matic') {
    log.debug('[+] Making matic faucet request')
    const receipt: ContractReceipt = await useMaticFaucet(body)
    return receipt
  } else {
    throw new Error(ERRORS.INVALID_REQUEST_PARAMS)
  }
}
