import { hasTokens, hasUsedAFaucetBefore, checkBlacklist } from '../faucet'
import { IUser } from './user'

export const FAUCET_RULES = {
  HAS_USED_FWEB3_FAUCET: 'HAS_USED_FWEB3_FAUCET',
  HAS_USED_MATIC_FAUCET: 'HAS_USED_MATIC_FAUCET',
  IS_BLACKLISTED: 'IS_BLACKLISTED',
  HAS_TOKENS: 'HAS_TOKENS',
  HAS_MATIC: 'HAS_MATIC',
}

export async function validateUserFaucetRules(
  network: string,
  user?: IUser
): Promise<string[]> {
  if (!user) {
    return []
  }
  const violations = []
  const accountAddress = user.account.split(':')[1]
  const { hasFweb3, hasMatic } = await hasTokens(network, accountAddress)
  if (hasFweb3) {
    violations.push(FAUCET_RULES.HAS_TOKENS)
  }
  if (hasMatic) {
    violations.push(FAUCET_RULES.HAS_MATIC)
  }
  const { fweb3, matic } = await hasUsedAFaucetBefore(accountAddress)
  if (fweb3) {
    violations.push(FAUCET_RULES.HAS_USED_FWEB3_FAUCET)
  }
  if (matic) {
    violations.push(FAUCET_RULES.HAS_USED_MATIC_FAUCET)
  }
  const blackListed = await checkBlacklist(user.ipinfo?.ip)
  if (blackListed) {
    violations.push(FAUCET_RULES.IS_BLACKLISTED)
  }
  console.debug(`[+] user violations found: ${JSON.stringify(violations)}`)
  return violations
}
