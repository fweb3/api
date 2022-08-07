import { createTwitterRecordForUser, getUser } from '../user/user.entity'
import { fetchTwitterUserData } from './twitter.api'
import { validateTwitter } from './twitter.validation'

interface IVerifyTwitterRequest {
  network: string
  account: string
  twitterHandle: string
}

export async function verifyUsersTwitter({
  network,
  account,
  twitterHandle,
}: IVerifyTwitterRequest) {
  const netAccount = `${network.toLowerCase()}:${account.toLowerCase()}`
  const userRecord = await getUser(netAccount)
  if (!userRecord) {
    console.debug('[-] user record not found for twitter verification')
    return {
      status: 'ok',
      allowed: false,
    }
  }
  const twitterUserData = await fetchTwitterUserData(twitterHandle.toString())
  console.debug(`[+] fetched twitter data: ${twitterUserData}`)
  const newUserWithTwitter = await createTwitterRecordForUser(
    netAccount,
    twitterUserData
  )
  console.debug(
    `[+] created new twitter record for: ${newUserWithTwitter.twitter.name}`
  )
  const invalidRules = validateTwitter(newUserWithTwitter.twitter)
  return {
    status: 'ok',
    invalidRules,
  }
}
