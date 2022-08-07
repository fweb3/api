export interface IUserVerifyRequest {
  network: string
  account: string
  clientInfo: {
    [key: string]: unknown
  }
}

export interface IIpinfoResponse {
  account: string
  hostname: string
  city: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
}

export interface IUser {
  account: string
  createdAt: Date
  updatedAt: Date
  email?: string
  twitter?: IUserTwitterData
  discord?: string
  ens?: string
  role: Role
  active: boolean
  ipinfo?: IUserIpInfo
}

export interface IUserTwitterData {
  account?: string
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

export interface IUserIpInfo {
  account: string
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

declare const UserRole: {
  PLAYER: 'PLAYER'
  ADMIN: 'ADMIN'
  ROOT: 'ROOT'
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

export type Role = typeof UserRole[keyof typeof UserRole]
