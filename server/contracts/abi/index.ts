/* eslint-disable */
import fweb3TokenFaucetInterface from './fweb3TokenFaucet.json'
import fweb3MaticFaucetInterface from './fweb3MaticFaucet.json'
import fweb3TokenInterface from './fweb3Token.json'
import fweb3DiamonNftInterface from './fweb3DiamondNFT.json'
interface IMap {
  [key: string]: any
}

const INTERFACE_MAP: IMap = {
  fweb3TokenFaucet: fweb3TokenFaucetInterface,
  fweb3MaticFaucet: fweb3MaticFaucetInterface,
  fweb3Token: fweb3TokenInterface,
  fweb3DiamondNft: fweb3DiamonNftInterface
}

export const loadAbi = (name: string) => {
  return INTERFACE_MAP[name].abi
}
