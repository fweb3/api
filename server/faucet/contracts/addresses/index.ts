import * as LOCAL_ADDRESSES from './local.json'
import * as MUMBAI_ADDRESSES from './mumbai.json'
import * as POLYGON_ADDRESSES from './polygon.json'
import * as ORIGINAL_ADDRESSES from './original.json'

interface IContractMap {
  [key: string]: {
    [key: string]: string | string[]
  }
}

const CONTRACT_MAP: IContractMap = {
  local: LOCAL_ADDRESSES,
  mumbai: MUMBAI_ADDRESSES,
  polygon: POLYGON_ADDRESSES,
  original: ORIGINAL_ADDRESSES,
}

export const getContractAddress = (network: string, name: string) => {
  return CONTRACT_MAP[network][name].toString()
}
