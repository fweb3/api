import { IUserTwitterData } from '../user/user.d'
// import { TWITTER_USER_BY_NAME_RESPONSE } from './__mocks__/twitter.fixtures'
import fetch from 'node-fetch'

const { TWITTER_BEARER_TOKEN } = process.env
const TWITTER_API_URL = 'https://api.twitter.com/2'

export interface ITwitterUsernameData {
  profile_image_url: string
  name: string
  username: string
  id: string
  public_metrics: {
    followers_count: number
    following_count: number
    tweet_count: number
    listed_count: number
  }
  verified: boolean
  location: string
  created_at: string
}

async function fetchTwitter(url: string) {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
      },
    }
    const res = await fetch(url, config)
    const { data } = await res.json()
    return data
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function fetchTwitterUserData(
  username: string
): Promise<IUserTwitterData> {
  try {
    const url = `${TWITTER_API_URL}/users/by/username/${username}?user.fields=created_at,verified,location,name,profile_image_url,public_metrics`
    const data = await fetchTwitter(url)
    if (!data?.id) return null
    const formatted = _sanitizeTwitterUsernameResponse(data)
    return formatted
  } catch (err) {
    console.error(err)
    return null
  }
}

export interface ITwitterTweets {
  id: string
  text: string
}

export async function fetchUsersTweets(
  id: string,
  startFrom: Date
): Promise<ITwitterTweets[]> {
  const url = `${TWITTER_API_URL}/users/${id}/tweets?start_time=${startFrom.toJSON()}`
  const tweets = await fetchTwitter(url)
  console.debug(
    `[+] fetched users tweets since ${startFrom.toJSON()} found: [${
      tweets?.length || 0
    }]`
  )
  return tweets
}

function _sanitizeTwitterUsernameResponse(
  data: ITwitterUsernameData
): IUserTwitterData {
  return {
    profileImageUrl: data.profile_image_url,
    name: data.name,
    twitterId: data.id,
    username: data.username,
    followersCount: data.public_metrics.followers_count,
    followingCount: data.public_metrics.following_count,
    tweetCount: data.public_metrics.tweet_count,
    location: data.location,
    twitterCreatedAt: new Date(data.created_at),
  }
}
