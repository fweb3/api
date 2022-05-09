/* eslint-disable */
import fweb3TokenFaucetInterface from './Fweb3TokenFaucet.json'
import fweb3MaticFaucetInterface from './Fweb3MaticFaucet.json'
import fweb3TokenInterface from './Fweb3Token.json'
interface IMap {
  [key: string]: any
}

const INTERFACE_MAP: IMap = {
  fweb3TokenFaucet: fweb3TokenFaucetInterface,
  fweb3MaticFaucet: fweb3MaticFaucetInterface,
  fweb3Token: fweb3TokenInterface,
}

export const loadAbi = (name: string) => {
  return INTERFACE_MAP[name].abi
}
