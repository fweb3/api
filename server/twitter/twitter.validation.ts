import { ITwitterUsernameData, IUserTwitterData } from './twitter.api'

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
}

export function validateTwitter(twitterData?: IUserTwitterData): string[] {
  const violations = []
  if (!twitterData.username) {
    return [TWITTER_RULES.NO_ACCOUNT]
  }
  const { twitterCreatedAt, followersCount, followingCount, tweetCount } =
    twitterData
  console.log('age::::', _calcAccountAge(twitterCreatedAt.toString()))
  const isOldEnough =
    _calcAccountAge(twitterCreatedAt.toString()) >= TWITTER_MIN_AGE_DAYS
  const isFollowingEnough = followingCount >= TWITTER_MIN_FOLLOWING
  const hasEnoughTweets = tweetCount >= TWITTER_MIN_TWEETS
  const hasEnoughFollowers = followersCount >= TWITTER_MIN_FOLLOWERS
  if (!isOldEnough) {
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
  return violations
}

function _calcAccountAge(accountCreatedAt: string): number {
  const day = 1000 * 60 * 60 * 24
  const now = parseInt(Date.now().toString())
  const then = Date.parse(accountCreatedAt)
  const age = Math.round((now - then) / day)
  return age
}
