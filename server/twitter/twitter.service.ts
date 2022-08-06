import { getUser } from '../user/user.entity'
// import { fetchUserIdFromName } from './twitter.api'

// twitter rules
// age > 3mo
// public_metrics.tweet_count >= 3
// public_metrics.following_count >= 5

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
    console.info('USER RECORD NOT FOUND FOR TWITTER VERIFICATION')
    return {
      status: 'ok',
      allowed: false,
    }
  }
  // const { data } = await fetchUserIdFromName(twitterHandle.toString())
  return {
    status: 'ok',
    tweet: twitterHandle,
  }
}
