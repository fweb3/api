import { hasTokens, hasUsedAFaucetBefore } from '../faucet'
import { User } from '@prisma/client'
import { findBlacklistByIp } from './blacklist.entity'

export const FAUCET_RULES = {
  FAUCET_HAS_USED_FWEB3_FAUCET: 'HAS_USED_FWEB3_FAUCET',
  FAUCET_HAS_USED_MATIC_FAUCET: 'HAS_USED_MATIC_FAUCET',
  FAUCET_IS_BLACKLISTED: 'IS_BLACKLISTED',
  FAUCET_HAS_TOKENS: 'HAS_TOKENS',
  FAUCET_HAS_MATIC: 'HAS_MATIC',
}

export async function validateUserFaucetRules(
  network: string,
  user: User
): Promise<string[]> {
  if (!user) {
    return []
  }
  const violations = []
  const accountAddress = user.account.split(':')[1]
  const { hasFweb3, hasMatic } = await hasTokens(network, accountAddress)

  if (hasFweb3) {
    violations.push(FAUCET_RULES.FAUCET_HAS_TOKENS)
  }
  if (hasMatic) {
    violations.push(FAUCET_RULES.FAUCET_HAS_MATIC)
  }
  const { fweb3, matic } = await hasUsedAFaucetBefore(accountAddress)
  if (fweb3) {
    violations.push(FAUCET_RULES.FAUCET_HAS_USED_FWEB3_FAUCET)
  }
  if (matic) {
    violations.push(FAUCET_RULES.FAUCET_HAS_USED_MATIC_FAUCET)
  }

  const foundBlackList = await findBlacklistByIp(user.ip)
  if (foundBlackList) {
    violations.push(foundBlackList.reason)
  }
  console.debug(`[+] user violations found: ${JSON.stringify(violations)}`)
  return violations
}
