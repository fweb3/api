// https://api.twitter.com/2/users/by/username/:username?user.fields=created_at,verified,location,name,profile_image_url,public_metrics

export const TWITTER_TWEETS_BY_ID = {
  data: [
    {
      id: '1556330648272453632',
      text: 'Test #fweb3faucet',
    },
  ],
  meta: {
    result_count: 1,
    newest_id: '1556330648272453632',
    oldest_id: '1556330648272453632',
  },
}

export const TWITTER_USER_BY_NAME_RESPONSE = {
  data: {
    profile_image_url:
      'https://pbs.twimg.com/profile_images/1285001002387558400/ordEOmMd_normal.jpg',
    name: 'rimraf.eth',
    username: 'hussybitch',
    id: '46763557',
    public_metrics: {
      followers_count: 28,
      following_count: 274,
      tweet_count: 303,
      listed_count: 3,
    },
    verified: false,
    location: 'Grants Pass, OR',
    created_at: '2009-06-12T22:22:49.000Z',
  },
}

// https://api.twitter.com/2/users/:id/tweets?start_time=2022-02-11T00:00:00.000Z
export const TWITTER_TWEETS_BY_TIME_RESPONSE = {
  data: [
    {
      id: '1537087520990605314',
      text: '@ErinInTheMorn 8k+ likes!? Fuuuck… I overheard a convo in a diner the other day with a religious screw-ball parroting this same garbage. He had a little more balls to come all the way out and just say it, “they need to be shot”',
    },
    {
      id: '1524760024752349184',
      text: 'RT @sophiamzaller: New disclosure in today\'s $COIN (Coinbase) 10-Q: 👀\n\n"In the event of a bankruptcy.....customers could be treated as our…',
    },
    {
      id: '1518445601377058816',
      text: 'RT @CroissantEth: Coinbase NFT and ENS are about to completely flip the script.\n\nI found recent smart contract deployments with some crazy…',
    },
    {
      id: '1503518055090974725',
      text: 'Verifying my @layer3xyz profile ✨\n\nsig:0xc1ebb287b2dd863d5913882ed0b693de12b67ee5de24767989334904d1c404a679f82f2e9e2e73df7061197a0f8036e99635a85b56496d1279da4d2e3f5d0ded1c\n\nhttps://t.co/b1Qk1jd1BR',
    },
  ],
  meta: {
    result_count: 4,
    newest_id: '1537087520990605314',
    oldest_id: '1503518055090974725',
  },
}
