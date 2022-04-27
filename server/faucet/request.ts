import { useFweb3Faucet } from './fweb3Faucet'
import { useMaticFaucet } from './maticFaucet'
import type { IFaucetBody } from './faucet.d'

export const requestDripFromFaucet = async (body: IFaucetBody) => {
  if (body.type.toLowerCase() === 'fweb3') {
    return useFweb3Faucet(body)
  } else if (body.type.toLowerCase() === 'matic') {
    return useMaticFaucet(body)
  } else {
    throw new Error('unknown faucet type')
  }
}
