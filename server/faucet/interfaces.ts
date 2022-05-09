import { AlchemyProvider, JsonRpcProvider } from '@ethersproject/providers'
import { Contract, ethers, Wallet } from 'ethers'
import { getContractAddress, loadAbi } from './contracts'
import { log } from '../logger'

const {
  LOCAL_PRIVK,
  MUMBAI_PRIVK,
  POLYGON_PRIVK,
  ALCHEMY_MAINNET_API_KEY,
  ALCHEMY_TESTNET_API_KEY,
} = process.env

export type Provider =
  | ethers.providers.JsonRpcProvider
  | ethers.providers.InfuraProvider
  | ethers.providers.BaseProvider
  | ethers.providers.AlchemyProvider

export interface IFweb3CoreInterfaces {
  network: string
  wallet: Wallet
  provider: Provider
}

export interface IFweb3Interfaces {
  fweb3Faucet: Contract
  maticFaucet: Contract
  fweb3Token: Contract
  provider: Provider
  network: string
}

const _buildCoreInterfaces = (network: string): IFweb3CoreInterfaces => {
  const provider = _getProvider(network)
  const privk = _getPrivk(network)
  const wallet = _getWallet(privk, provider)
  return {
    network,
    provider,
    wallet,
  }
}

export const getFweb3Interfaces = async (
  network: string
): Promise<IFweb3Interfaces> => {
  const { wallet, provider } = await _buildCoreInterfaces(network)

  const fweb3TokenAddress = getContractAddress(network, 'fweb3Token')
  const fweb3FaucetAddress = getContractAddress(network, 'fweb3TokenFaucet')
  const maticFaucetAddress = getContractAddress(network, 'fweb3MaticFaucet')

  const fweb3FaucetAbi = loadAbi('fweb3TokenFaucet')
  const maticFaucetAbi = loadAbi('fweb3MaticFaucet')
  const fweb3TokenAbi = loadAbi('fweb3Token')

  const fweb3Faucet = new ethers.Contract(
    fweb3FaucetAddress,
    fweb3FaucetAbi,
    wallet
  )

  const fweb3Token = new ethers.Contract(
    fweb3TokenAddress,
    fweb3TokenAbi,
    wallet
  )

  const maticFaucet = new ethers.Contract(
    maticFaucetAddress,
    maticFaucetAbi,
    wallet
  )

  return {
    fweb3Faucet,
    fweb3Token,
    maticFaucet,
    provider,
    network,
  }
}

const _getProvider = (network: string): Provider => {
  if (network === 'polygon' || network === 'original') {
    log.debug(`[+] using mainnet provider`)
    return new AlchemyProvider('matic', ALCHEMY_MAINNET_API_KEY)
  } else if (network === 'mumbai') {
    log.debug(`[+] using mumbai alchemy provider`)
    return new AlchemyProvider('maticmum', ALCHEMY_TESTNET_API_KEY)
  } else {
    log.debug(`[+] using local provider rpc provider`)
    return new JsonRpcProvider('http://localhost:8545')
  }
}

const _getPrivk = (network: string): string => {
  if (network === 'polygon') {
    log.debug('[+] using polygon wallet')
    return POLYGON_PRIVK || ''
  } else if (network === 'mumbai') {
    log.debug('[+] using mumbai wallet')
    return MUMBAI_PRIVK || ''
  } else {
    log.debug('[+] using local wallet')
    return LOCAL_PRIVK || ''
  }
}

const _getWallet = (privk: string, provider: Provider) => {
  return new ethers.Wallet(privk, provider)
}
