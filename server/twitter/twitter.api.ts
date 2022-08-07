import { TWITTER_USER_BY_NAME_RESPONSE } from './__mocks__/twitter.fixtures'

const { TWITTER_BEARER_TOKEN } = process.env
const TWITTER_API_URL = 'https://api.twitter.com/2'

// ata: {
//     profile_image_url:
//       'https://pbs.twimg.com/profile_images/1285001002387558400/ordEOmMd_normal.jpg',
//     name: 'rimraf.eth',
//     username: 'hussybitch',
//     id: '46763557',
//     public_metrics: {
//       followers_count: 28,
//       following_count: 274,
//       tweet_count: 303,
//       listed_count: 3,
//     },
//     verified: false,
//     location: 'Grants Pass, OR',
//     created_at: '2009-06-12T22:22:49.000Z',
//   },

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

export interface IUserTwitterData {
  profileImageUrl?: string
  name?: string
  twitterId?: string
  username?: string
  followersCount?: number
  followingCount?: number
  tweetCount?: number
  location?: string
  twitterCreatedAt?: Date
}

interface ITwitterUserByUsernameRes {
  data?: ITwitterUsernameData
}

function _createTwitterConfig() {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
    },
  }
}

export async function fetchTwitterUserData(
  username: string
): Promise<IUserTwitterData> {
  try {
    const url = `${TWITTER_API_URL}/users/by/username/${username}`
    const opts = _createTwitterConfig()
    const res = await fetch(url, opts)
    const data = await res.json()
    // return _sanitizeTwitterUsernameResponse(data)
    return _sanitizeTwitterUsernameResponse(TWITTER_USER_BY_NAME_RESPONSE)
  } catch (err) {
    console.error(err)
    return null
  }
}

function _sanitizeTwitterUsernameResponse({
  data,
}: ITwitterUserByUsernameRes): IUserTwitterData {
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
