export interface IUserVerifyRequest {
  network: string
  account: string
  clientInfo: {
    [key: string]: unknown
  }
}

export interface IIpinfoResponse {
  ip: string
  hostname: string
  city: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
}

export interface IUser {
  id: string
  createdAt: Date
  updatedAt: Date
  account: string
  email?: string
  twitter: ITwitterData
  discord?: string
  ens?: string
  role: Role
  active: boolean
  ipinfo: IIpInfo
}

export interface IGameTaskState {
  hasUsedFweb3Faucet?: boolean
  hasUsedMaticFaucet?: boolean
  hasSentTokens?: boolean
  hasMintedDiamondNFT?: boolean
  hasBurnedTokens?: boolean
  hasSwappedTokens?: boolean
  hasVotedInPoll?: boolean
  hasDeployedContract?: boolean
  hasWonGame?: boolean
  trophyId?: string
}

export interface ITwitterData {
  id?: string
  userId?: string
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

export interface IIpInfo {
  id?: string
  userId?: string
  ip?: string
  hostname?: string
  country?: string
  city?: string
  region?: string
  loc?: string
  org?: string
  postal?: string
  timezone?: string
}

declare const Role: {
  PLAYER: 'PLAYER'
  ADMIN: 'ADMIN'
  ROOT: 'ROOT'
}

export type Role = typeof Role[keyof typeof Role]
