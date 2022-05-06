import { AlchemyProvider, JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
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

export const getProvider = (network: string): Provider => {
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

export const getPrivk = (network: string): string => {
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
