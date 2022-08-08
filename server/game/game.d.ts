export interface GameTaskState {
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
