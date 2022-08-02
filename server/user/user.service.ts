import { calculateGameState } from './../game/tasks'
import { IUserVerifyRequest } from './user.d'
import { getUser, createUser } from './user.entity'

export enum AllowedNetworks {
  POLYGON,
  MUMBAI,
  LOCAL,
}

const _netAccount = ({ network, account }: IUserVerifyRequest) => {
  return `${network.toLocaleLowerCase()}:${account.toString()}`
}

export async function verifyGetOrCreateUser(incomingBody: IUserVerifyRequest) {
  const { network, account, clientInfo } = incomingBody
  _verifyNetworkOrThrow(network.toString())
  const userRecord = await getUser(_netAccount(incomingBody))
  if (userRecord) {
    return {
      created: false,
      ...userRecord,
      taskState: await calculateGameState(network, account),
    }
  }
  const networkAccount = `${network}:${account}`
  const newUser = await createUser({
    account: networkAccount,
    ip: clientInfo.ip,
    clientInfo: JSON.stringify(clientInfo),
    ipinfo: {
      create: {
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
      },
    },
  })
  return { created: true, ...newUser }
}

function _verifyNetworkOrThrow(network: string) {
  const allowed = Object.values(AllowedNetworks).includes(network.toUpperCase())
  if (!allowed) {
    throw new Error('EVM Network Not Allowed')
  }
  return null
}
