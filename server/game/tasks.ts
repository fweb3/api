import { ethers } from 'ethers'
import type { IPolygonResponse, IPolygonResult } from './polygonscan/types'
import {
  getContractAddress,
  GENESYS_ADDRESS,
  SWAP_ROUTER_V2,
  BURN_ADDRESS,
} from '../contracts'
import {
  fetchERC20TransferEvents,
  fetchInternalTransactions,
  fetchERC721TransferEvents,
  fetchNormalTransactions,
} from './polygonscan'
import { DEFAULT_STATE } from './states'

export const calculateGameState = async (network: string, account: string) => {
  const normalTxRelatedState = await normalTxRelated(network, account)
  const internalRelatedState = await internalTxRelated(network, account)
  const erc20TransferRelatedState = await erc20TransferRelated(network, account)
  const erc721TransferRelatedState = await erc721TokenTransferRelated(
    network,
    account
  )
  const state = {
    ...DEFAULT_STATE,
    ...internalRelatedState,
    ...erc20TransferRelatedState,
    ...erc721TransferRelatedState,
    ...normalTxRelatedState,
  }
  // If in dev set swapped to true
  // there is no testnet swap for polygon
  if (network !== 'polygon') {
    return {
      ...state,
      hasSwappedTokens: true,
    }
  }
  return state
}

const normalTxRelated = async (network: string, account: string) => {
  const { result }: IPolygonResponse = await fetchNormalTransactions(
    network,
    account
  )

  const hasVotedInPoll = await checkHasVotedInPoll(network, result)
  const hasDeployedContract = await checkHasDeployedContract(result)
  return {
    hasVotedInPoll,
    hasDeployedContract,
  }
}
const internalTxRelated = async (network: string, account: string) => {
  const { result }: IPolygonResponse = await fetchInternalTransactions(
    network,
    account
  )

  const hasUsedMaticFaucet = await checkHasUsedMaticFaucet(network, result)
  const hasSwappedTokens = await checkHasSwappedTokens(result)
  return {
    hasUsedMaticFaucet,
    hasSwappedTokens,
  }
}

const erc20TransferRelated = async (network: string, account: string) => {
  const fweb3TokenAddress = getContractAddress(network, 'fweb3Token')
  const { result }: IPolygonResponse = await fetchERC20TransferEvents(
    network,
    account,
    fweb3TokenAddress
  )

  const hasUsedFweb3Faucet = await checkHasUsedFweb3Faucet(network, result)
  const hasSentTokens = await checkHasSentFweb3(account, result)
  const hasBurnedTokens = await checkHasBurnedTokens(account, result)
  return {
    hasUsedFweb3Faucet,
    hasSentTokens,
    hasBurnedTokens,
  }
}

const erc721TokenTransferRelated = async (network: string, account: string) => {
  const { result }: IPolygonResponse = await fetchERC721TransferEvents(
    network,
    account
  )

  const hasMintedDiamondNFT = await checkHasMintedDiamondNFT(network, result)
  return {
    hasMintedDiamondNFT,
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
    result?.filter((tx) => _lower(tx.from) === _lower(fweb3MaticFaucetAddress))
      .length !== 0
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
    result?.filter((tx) => _lower(tx.from) === _lower(fweb3MaticFaucetAddress))
      .length !== 0
  )
}

// from is from account with fweb3 token address & value is >= 100eth
const checkHasSentFweb3 = async (account: string, result: IPolygonResult[]) => {
  return (
    result?.filter((tx) => {
      const isFrom = _lower(tx.from) === _lower(account)
      const value = parseInt(ethers.utils.formatEther(tx.value || ''))
      const sentEnough = value >= 100
      return isFrom && sentEnough
    }).length !== 0
  )
}

const checkHasMintedDiamondNFT = async (
  network: string,
  result: IPolygonResult[]
) => {
  const originFweb3DiamondNFTAddress = getContractAddress(
    network,
    'originalFweb3DiamondNft'
  )
  const fweb3DiamondNFTAddress = getContractAddress(network, 'fweb3DiamondNft')
  return (
    result?.filter((tx) => {
      const isGenesys = _lower(tx.from) === _lower(GENESYS_ADDRESS)
      const isOriginDiamond =
        _lower(originFweb3DiamondNFTAddress) === _lower(tx.contractAddress)
      const isDiamondNft =
        _lower(fweb3DiamondNFTAddress) === _lower(tx.contractAddress)
      return (isGenesys && isOriginDiamond) || (isGenesys && isDiamondNft)
    }).length !== 0
  )
}

const checkHasBurnedTokens = async (
  account: string,
  result: IPolygonResult[]
) => {
  return (
    result?.filter((tx) => {
      const wasAccount = _lower(account) === _lower(tx.from)
      const burnAmt = parseInt(ethers.utils.formatEther(tx.value))
      const sentToBurn = _lower(tx.to) === _lower(BURN_ADDRESS)
      return wasAccount && burnAmt >= 1 && sentToBurn
    }).length !== 0
  )
}

const checkHasSwappedTokens = async (result: IPolygonResult[]) => {
  return (
    result?.filter((tx) => {
      return _lower(tx.to) === _lower(SWAP_ROUTER_V2)
    }).length !== 0
  )
}

const checkHasVotedInPoll = async (
  network: string,
  result: IPolygonResult[]
) => {
  const originalPollAddress = getContractAddress(network, 'originalFweb3Poll')
  const fweb3Poll = getContractAddress(network, 'fweb3Poll')
  return (
    result?.filter((tx) => {
      const votedInOriginalPoll = _lower(tx.to) === _lower(originalPollAddress)
      const votedInFweb3Poll = _lower(tx.to) === _lower(fweb3Poll)
      return votedInOriginalPoll || votedInFweb3Poll
    }).length !== 0
  )
}

const checkHasDeployedContract = (result: IPolygonResult[]) => {
  return result?.filter((tx) => _lower(tx.to) === '').length !== 0
}

const _lower = (str) => str.toLowerCase()
