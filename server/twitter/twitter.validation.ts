import { Twitter } from '@prisma/client'
import { fetchUsersTweets, ITwitterTweets } from './twitter.api'
import { generatePPKDF2 } from './twitter.service'

const VALIDITY_HASHTAG = '#fweb3faucet'
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

export async function validateTwitter(
  twitterRecord: Twitter
): Promise<string[]> {
  const violations = []
  const {
    twitterCreatedAt,
    followersCount,
    followingCount,
    tweetCount,
    username,
  } = twitterRecord

  if (!username) {
    return [TWITTER_RULES.NO_ACCOUNT]
  }

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
  if (violations.length === 0) {
    const hasValidTweet = await fetchAndCheckTweets(twitterRecord)

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

export async function fetchAndCheckTweets(twitterRecord: Twitter) {
  const tweetsFromLastHour = await fetchUsersTweets(twitterRecord.twitterId)
  return checkHasValidTweet(twitterRecord.account, tweetsFromLastHour)
}

export function checkHasValidTweet(
  netAccount: string,
  accountTweets: ITwitterTweets[]
) {
  if (!accountTweets) return false
  const hash = generatePPKDF2(netAccount, process.env.TWITTER_VERIFY_SALT)
  const hasValidTweet =
    accountTweets?.filter(({ text }) => {
      return text.includes(`${VALIDITY_HASHTAG} ${hash}`)
    }).length !== 0
  if (hasValidTweet) return hasValidTweet

  const atteptedBadTweet = accountTweets.filter(({ text }) => {
    return text.match(/\w{64}+$/)
  })

  if (atteptedBadTweet) {
    // create blacklist
  }
  return false
}
