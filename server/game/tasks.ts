import { getContractAddress } from '../contracts'
import { ethers } from 'ethers'
import {
  fetchERC20TransferEvents,
  fetchInternalTransactions,
} from './polygonscan'
import type { IPolygonResponse, IPolygonResult } from './polygonscan/types'
// use fweb3 faucet ✅
// use matic faucet ✅
// send 100 fweb3
// mint fweb3 nft
// burn 1 fweb3
// swap fweb3
// vote on fweb3 poll
// write and deploy contract

const DEFAULT_STATE = {
  hasUsedFweb3Faucet: false,
  hasUsedMaticFaucet: false,
  hasSentTokens: false,
  hasMintedNFT: false,
  hasBurnedTokens: false,
  hasSwappedTokens: false,
  hasVotedInPoll: false,
  hasDeployedContract: false,
  hasWonGame: false,
  trophyId: '',
}

export const calculateGameState = async (network: string, account: string) => {
  const internalRelatedState = await internalTxRelated(network, account)
  const erc20TransferRelatedState = await erc20TransferRelated(network, account)
  return {
    ...DEFAULT_STATE,
    ...internalRelatedState,
    ...erc20TransferRelatedState,
  }
}

export const internalTxRelated = async (network: string, account: string) => {
  const { result }: IPolygonResponse = await fetchInternalTransactions(
    network,
    account
  )

  const hasUsedMaticFaucet = await checkHasUsedMaticFaucet(network, result)
  return {
    hasUsedMaticFaucet,
  }
}

export const erc20TransferRelated = async (
  network: string,
  account: string
) => {
  const fweb3TokenAddress = getContractAddress(network, 'fweb3Token')
  const { result }: IPolygonResponse = await fetchERC20TransferEvents(
    network,
    account,
    fweb3TokenAddress
  )

  const hasUsedFweb3Faucet = await checkHasUsedFweb3Faucet(network, result)
  const hasSentTokens = await checkHasSentFweb3(account, result)
  return {
    hasUsedFweb3Faucet,
    hasSentTokens,
  }
}

const checkHasUsedFweb3Faucet = async (
  network: string,
  result: IPolygonResult[]
): Promise<boolean> => {
  const fweb3MaticFaucetAddress = getContractAddress(
    network,
    'fweb3TokenFaucet'
  )
  return (
    result?.filter(
      (tx) => tx.from.toLowerCase() === fweb3MaticFaucetAddress.toLowerCase()
    ).length !== 0
  )
}

export const checkHasUsedMaticFaucet = async (
  network: string,
  result: IPolygonResult[]
) => {
  const fweb3MaticFaucetAddress = getContractAddress(
    network,
    'fweb3MaticFaucet'
  )
  return (
    result?.filter(
      (tx) => tx.from.toLowerCase() === fweb3MaticFaucetAddress.toLowerCase()
    ).length !== 0
  )
}

// from is from account with fweb3 token address & value is >= 100eth
const checkHasSentFweb3 = async (account: string, result: IPolygonResult[]) => {
  return (
    result?.filter((tx) => {
      const isFrom = tx.from.toLowerCase() === account.toLowerCase()
      const value = parseInt(ethers.utils.formatEther(tx.value || ''))
      const sentEnough = value >= 100
      return isFrom && sentEnough
    }).length !== 0
  )
}
