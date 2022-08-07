import { calculateGameState } from './../game/tasks'
import { checkBlacklist } from './../faucet/validate';
import { getUser, createUser } from './user.entity'
import { hasTokens, hasUsedAFaucetBefore } from '../faucet'
import { IGameTaskState, IUser, IUserVerifyRequest } from './user.d'
import CryptoJS from 'crypto-js'

export enum AllowedNetworks {
  POLYGON,
  MUMBAI,
  LOCAL,
}

const _netAccount = ({ network, account }: IUserVerifyRequest) => {
  return `${network.toLocaleLowerCase()}:${account.toString()}`
}

interface IUserPayload extends IUser {
  created: boolean
  taskState?: IGameTaskState
  notAllowedReasons?: string[]
}

export async function verifyGetOrCreateUser(
  incomingBody: IUserVerifyRequest
): Promise<IUserPayload> {
  const { network, account, clientInfo } = incomingBody
  _verifyNetworkOrThrow(network.toString())
  const netAccount = _netAccount(incomingBody)
  const userRecord = await getUser(netAccount)
  if (userRecord) {
    console.debug('[+] Found user:', userRecord.account.substring(0, 15))
    const userPayload = {
      created: false,
      ...userRecord,
      taskState: await calculateGameState(network, account),
    }
    return {
      ...userPayload,
      notAllowedReasons: await _checkCanUseFaucet(network, userPayload),
    }
  }
  const networkAccount = `${network}:${account}`
  const verifySalt = CryptoJS.lib.WordArray.random(128 / 8).toString()
  const newUser = await createUser({
    account: networkAccount.toLowerCase(),
    ip: clientInfo.ip,
    clientInfo: JSON.stringify(clientInfo),
    verifySalt,
    verifyHash: _createVerificationHash(networkAccount, verifySalt),
    ipinfo: {
      create: {
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
      },
    },
  })
  console.debug('[+] Created new user:', newUser.account.substring(0, 15))
  return { created: true, ...newUser, notAllowedReasons: [] }
}

export const FAUCET_RULES = {
  HAS_USED_FWEB3_FAUCET: 'HAS_USED_FWEB3_FAUCET',
  HAS_USED_MATIC_FAUCET: 'HAS_USED_MATIC_FAUCET',
  IS_BLACKLISTED: 'IS_BLACKLISTED',
  HAS_TOKENS: 'HAS_TOKENS',
  HAS_MATIC: 'HAS_MATIC',
}

async function _checkCanUseFaucet(
  network: string,
  user?: IUserPayload
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
  console.debug(`[+] violations found: ${JSON.stringify(violations)}`)
  return violations
}

function _createVerificationHash(str: string, salt: string) {
  return CryptoJS.PBKDF2(str, salt, { keySize: 256 / 32 }).toString()
}

function _verifyNetworkOrThrow(network: string) {
  const allowed = Object.values(AllowedNetworks).includes(network.toUpperCase())
  if (!allowed) {
    throw new Error('EVM Network Not Allowed')
  }
  return null
}
