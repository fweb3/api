import { fetchUsersTweets, ITwitterTweets } from './twitter.api'
import { IUser } from './../user/user.d'
import CryptoJS from 'crypto-js'

const VALIDITY_HASH = '#fweb3faucet'
const TWITTER_MIN_AGE_DAYS = 90
const TWITTER_MIN_TWEETS = 3
const TWITTER_MIN_FOLLOWING = 3
const TWITTER_MIN_FOLLOWERS = 3

export const TWITTER_RULES = {
  NOT_OLD_ENOUGH: 'NOT_OLD_ENOUGH',
  NOT_ENOUGH_TWEETS: 'NOT_ENOUGH_TWEETS',
  NOT_ENOUGH_FOLLOWING: 'NOT_ENOUGH_FOLLOWING',
  NOT_ENOUGH_FOLLOWERS: 'NOT_ENOUGH_FOLLOWERS',
  NO_ACCOUNT: 'NO_ACCOUNT',
  NO_VALID_TWEETS: 'NO_VALID_TWEETS',
}

export async function validateTwitter(userRecord?: IUser): Promise<string[]> {
  const violations = []
  const { twitter: twitterData } = userRecord
  if (!twitterData?.username) {
    return [TWITTER_RULES.NO_ACCOUNT]
  }
  const { twitterCreatedAt, followersCount, followingCount, tweetCount } =
    twitterData

  const accountOldEnough =
    _calcAgeFromDate(twitterCreatedAt) >= TWITTER_MIN_AGE_DAYS
  const isFollowingEnough = followingCount >= TWITTER_MIN_FOLLOWING
  const hasEnoughTweets = tweetCount >= TWITTER_MIN_TWEETS
  const hasEnoughFollowers = followersCount >= TWITTER_MIN_FOLLOWERS

  if (!accountOldEnough) {
    violations.push(TWITTER_RULES.NOT_OLD_ENOUGH)
  }

  if (!hasEnoughTweets) {
    violations.push(TWITTER_RULES.NOT_ENOUGH_TWEETS)
  }

  if (!isFollowingEnough) {
    violations.push(TWITTER_RULES.NOT_ENOUGH_FOLLOWING)
  }

  if (!hasEnoughFollowers) {
    violations.push(TWITTER_RULES.NOT_ENOUGH_FOLLOWERS)
  }

  // only fetch tweets and validate if they're clear so far
  if (violations.length !== 0) {
    const anHourAgo = new Date(Date.now() - 1000 * 60 * 60)
    const accountTweets = await fetchUsersTweets(
      twitterData.twitterId,
      anHourAgo
    )
    const hasValidTweet = _hasValidTweet(userRecord.account, accountTweets)

    if (!hasValidTweet) {
      violations.push(TWITTER_RULES.NO_VALID_TWEETS)
    }
  }

  return violations
}

function _calcAgeFromDate(date: Date): number {
  const day = 1000 * 60 * 60 * 24
  const now = new Date().getTime()
  const then = date.getTime()
  const age = Math.round((now - then) / day)
  return age
}

function _createPbkdf2(str: string, salt: string) {
  return CryptoJS.PBKDF2(str, salt, { keySize: 256 / 32 }).toString()
}

function _hasValidTweet(netAccount: string, accountTweets: ITwitterTweets[]) {
  const hash = _createPbkdf2(netAccount, process.env.TWITTER_VERIFY_SALT)
  return (
    accountTweets?.filter(({ text }) => {
      return text.includes(`${VALIDITY_HASH} ${hash}`)
    }).length !== 0
  )
}
