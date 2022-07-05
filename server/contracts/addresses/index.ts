import * as LOCAL_ADDRESSES from './localhost.json'
import * as MUMBAI_ADDRESSES from './mumbai.json'
import * as POLYGON_ADDRESSES from './polygon.json'
import * as ORIGINAL_ADDRESSES from './original.json'
import { AllowedNetwork } from '../../enums'

interface IContractMap {
  [key: string]: {
    [key: string]: string | string[]
  }
}

const CONTRACT_MAP: IContractMap = {
  localhost: LOCAL_ADDRESSES,
  mumbai: MUMBAI_ADDRESSES,
  polygon: POLYGON_ADDRESSES,
  original: ORIGINAL_ADDRESSES,
}

export const getContractAddress = (network: string, name: string) => {
  const isAllowed = Object.keys(AllowedNetwork).includes(network.toUpperCase())
  if (isAllowed) {
    return CONTRACT_MAP[network][name].toString()
  }
  throw new Error('Network not allowed to load contract address')
}
