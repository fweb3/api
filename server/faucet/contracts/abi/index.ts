/* eslint-disable */
import * as fweb3TokenFaucetInterface from './Fweb3TokenFaucet.json'
import * as fweb3MaticFaucetInterface from './Fweb3MaticFaucet.json'
import * as fweb3TokenInterface from './Fweb3Token.json'
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
