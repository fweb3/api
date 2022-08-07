import { fetchTwitterUserData } from './twitter.api'
import { upsertUserTwitterRecord, getUser } from '../user/user.entity'
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
      status: 'error',
      message: 'No account found to verify twitter against',
    }
  }
  const twitterUserData = await fetchTwitterUserData(twitterHandle.toString())
  console.debug(`[+] fetched twitter data!`)
  const updatedUserRecord = await upsertUserTwitterRecord(
    netAccount,
    twitterUserData
  )
  console.debug(
    `[+] created new twitter record: ${JSON.stringify(
      updatedUserRecord.twitter
    )}`
  )
  const ruleViolations = await validateTwitter(updatedUserRecord)
  console.debug(`[+] twitter rule violations ${JSON.stringify(ruleViolations)}`)
  return {
    status: 'ok',
    ruleViolations,
  }
}
