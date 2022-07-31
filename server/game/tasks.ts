import { ethers } from 'ethers'
import type { IPolygonResult } from '../polygonscan/types'
import { loadAddresses } from '../contracts/addresses'
import {
  fetchERC20TransferEvents,
  fetchInternalTransactions,
  fetchERC721TransferEvents,
  fetchNormalTransactions,
} from '../polygonscan'
import { DEFAULT_STATE } from './states'

export const calculateGameState = async (network: string, account: string) => {
  const normalTxRelatedState = await normalTxRelated(network, account)
  console.info('PROCESSED NORMAL TX')
  const internalRelatedState = await internalTxRelated(network, account)
  console.info('PROCESSED INTERNAL TX')
  const erc20TransferRelatedState = await erc20TransferRelated(network, account)
  console.info('PROCESSED ERC20 TRANSFER TX')
  const erc721TransferRelatedState = await erc721TokenTransferRelated(
    network,
    account
  )
  console.info('PROCESSED ERC721 TRANSFER TX')
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
  const { result } = await fetchNormalTransactions(network, account)
  const hasVotedInPoll = await checkHasVotedInPoll(network, result)
  const hasDeployedContract = await checkHasDeployedContract(result)
  return {
    hasVotedInPoll,
    hasDeployedContract,
  }
}
const internalTxRelated = async (network: string, account: string) => {
  const { result } = await fetchInternalTransactions(network, account)
  console.info('fetched internal tx')
  const hasUsedMaticFaucet = await checkHasUsedMaticFaucet(network, result)
  console.info('checked if used matic faucet')
  const hasSwappedTokens = await checkHasSwappedTokens(network, result)
  console.info('check has swapped tokens')
  return {
    hasUsedMaticFaucet,
    hasSwappedTokens,
  }
}

const erc20TransferRelated = async (network: string, account: string) => {
  const fweb3TokenAddress = loadAddresses(network, 'fweb3_token')[0]
  const { result } = await fetchERC20TransferEvents(
    network,
    account,
    fweb3TokenAddress
  )

  const hasUsedFweb3Faucet = await checkHasUsedFweb3Faucet(network, result)
  const hasSentTokens = await checkHasSentFweb3(account, result)
  const hasBurnedTokens = await checkHasBurnedTokens(network, account, result)
  return {
    hasUsedFweb3Faucet,
    hasSentTokens,
    hasBurnedTokens,
  }
}

const erc721TokenTransferRelated = async (network: string, account: string) => {
  const { result } = await fetchERC721TransferEvents(network, account)
  const { hasMintedDiamondNFT, hasWonGame, trophyId } =
    await checkHasMintedNFTs(network, result)
  return {
    hasMintedDiamondNFT,
    hasWonGame,
    trophyId,
  }
}

const checkHasUsedFweb3Faucet = async (
  network: string,
  result: IPolygonResult[]
): Promise<boolean> => {
  const fweb3FaucetAddresses = loadAddresses(network, 'fweb3_token_faucet')
  return (
    result?.filter(
      (tx) =>
        _lower(tx.from) ===
        fweb3FaucetAddresses
          .map((address) => _lower(address))
          .includes(_lower(tx.to))
    ).length !== 0
  )
}

export const checkHasUsedMaticFaucet = async (
  network: string,
  result: IPolygonResult[]
) => {
  const maticFaucetAddresses = loadAddresses(network, 'fweb3_matic_faucet')
  return (
    result?.filter(
      (tx) =>
        (_lower(tx.from) === _lower(tx.from)) ===
        maticFaucetAddresses
          .map((address) => _lower(address))
          .includes(_lower(tx.to))
    ).length !== 0
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

const checkHasMintedNFTs = async (
  network: string,
  results: IPolygonResult[]
) => {
  const fweb3DiamonNftAddresses = loadAddresses(network, 'fweb3_diamond_nft')[0]
  const fweb3TrophyAddress = loadAddresses(network, 'fweb3_trophy')[0]
  return {
    hasMintedDiamondNFT:
      _nftRecord(fweb3DiamonNftAddresses, results).length !== 0,
    ..._hasWonGame(fweb3TrophyAddress, results),
  }
}

const _hasWonGame = (contractAddress: string, results: IPolygonResult[]) => {
  const record = _nftRecord(contractAddress, results)
  const trophyId = record?.[0]?.tokenID || ''
  return {
    hasWonGame: record.length !== 0,
    trophyId,
  }
}

const _nftRecord = (contractAddress: string, result: IPolygonResult[]) => {
  const genesysAddress = loadAddresses('polygon', 'genesys')[0]
  return result?.filter((tx) => {
    const isGenesys = _lower(tx.from) === _lower(genesysAddress)
    const hasNft = _lower(contractAddress) === _lower(tx.contractAddress)
    return isGenesys && hasNft
  })
}

const checkHasBurnedTokens = async (
  network: string,
  account: string,
  result: IPolygonResult[]
) => {
  const burnAddress = loadAddresses(network, 'burn')[0]
  return (
    result?.filter((tx) => {
      const wasAccount = _lower(account) === _lower(tx.from)
      const burnAmt = parseInt(ethers.utils.formatEther(tx.value))
      const sentToBurn = _lower(tx.to) === _lower(burnAddress)
      return wasAccount && burnAmt >= 1 && sentToBurn
    }).length !== 0
  )
}

const checkHasSwappedTokens = async (network, result: IPolygonResult[]) => {
  const swapRouterAddress = loadAddresses(network, 'swap_router')[0]
  return (
    result?.filter((tx) => {
      return _lower(tx.to) === _lower(swapRouterAddress)
    }).length !== 0
  )
}

const checkHasVotedInPoll = async (
  network: string,
  result: IPolygonResult[]
) => {
  const fweb3Poll = loadAddresses(network, 'fweb3_poll')[0]
  return (
    result?.filter((tx) => _lower(tx.to) === _lower(fweb3Poll)).length !== 0
  )
}

const checkHasDeployedContract = (result: IPolygonResult[]) => {
  return result?.filter((tx) => _lower(tx.to) === '').length !== 0
}

const _lower = (str) => str.toLowerCase()
