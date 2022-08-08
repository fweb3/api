import { calculateGameState } from './../game/tasks'
import { getUser, createUser } from './user.entity'
import { IClientPayload } from '../index.d'
import { IUserVerifyRequest } from './user.d'
import { validateUserFaucetRules } from './user.validators'

export enum AllowedNetworks {
  POLYGON,
  MUMBAI,
  LOCAL,
}

const _netAccount = ({ network, account }: IUserVerifyRequest) => {
  return `${network.toLocaleLowerCase()}:${account.toString()}`
}

export async function verifyGetOrCreateUser(
  incomingBody: IUserVerifyRequest
): Promise<IClientPayload> {
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
      status: 'ok',
      ...userPayload,
      ruleViolations: await validateUserFaucetRules(network, userPayload),
    }
  }
  const networkAccount = `${network}:${account}`

  const newUser = await createUser({
    account: networkAccount.toLowerCase(),
    ip: clientInfo.ip as string,
    clientInfo: JSON.stringify(clientInfo),
  })
  console.debug('[+] Created new user:', newUser.account.substring(0, 15))
  return { status: 'ok', created: true, ...newUser, ruleViolations: [] }
}

function _verifyNetworkOrThrow(network: string) {
  const allowed = Object.values(AllowedNetworks).includes(network.toUpperCase())
  if (!allowed) {
    throw new Error('EVM Network Not Allowed')
  }
  return null
}
