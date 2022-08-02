const { TWITTER_BEARER_TOKEN } = process.env

const TWITTER_API_URL = 'https://api.twitter.com/2'

function _createOpts() {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
    },
  }
}

export async function fetchUserIdFromName(username: string) {
  try {
    const url = `${TWITTER_API_URL}/users/by/username/${username}`
    const opts = _createOpts()
    const res = await fetch(url, opts)
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
    return null
  }
}
