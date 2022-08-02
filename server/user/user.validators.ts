import { IUser } from './user.d'
import { hasUsedAFaucetBefore } from '../faucet'
/*
  Rules:
  - active
  - hasnt used faucet before
  - allowed country
*/

function _isActive(userData: IUser) {
  return userData.active || false
}

async function _hasUsedFaucet(network: string, account: string) {
  if (network.toLowerCase() === 'polygon') {
    const { fweb3, matic } = await hasUsedAFaucetBefore(account.toString())
    return fweb3 || matic
  }
  // if any other net than mainnet, let 'em drip
  return false
}

function _isAllowedCountry(userData: IUser) {
  //
}
