import { fetchTwitterDataByUsername } from './twitter.api'
import { upsertUserTwitterRecord, getUser } from '../user/user.entity'
import { validateTwitter } from './twitter.validation'
import CryptoJS from 'crypto-js'

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
      message: 'USER_NOT_FOUND',
    }
  }
  // check blacklist

  if (userRecord?.twitter?.twitterId) {
    // have twitter, time to verify
    console.log('have twitter records')
  }
  const twitterUserData = await fetchTwitterDataByUsername(
    twitterHandle.toString()
  )
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
  const ruleViolations = await validateTwitter(updatedUserRecord.twitter)
  console.debug(`[+] twitter rule violations ${JSON.stringify(ruleViolations)}`)
  return {
    status: 'ok',
    ruleViolations,
  }
}

export function generatePPKDF2(str: string, salt: string) {
  return CryptoJS.PBKDF2(str, salt, { keySize: 256 / 32 }).toString()
}
