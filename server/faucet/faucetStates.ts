import { Contract, ethers } from 'ethers'
import { getFweb3Interfaces, IFweb3Interfaces } from './interfaces'

export const fetchCurrentFaucetState = async (network: string) => {
  const interfaces: IFweb3Interfaces = await getFweb3Interfaces(network)
  const fweb3 = await _fweb3State(interfaces)
  const matic = await _maticState(interfaces)
  return {
    fweb3,
    matic,
  }
}

const _fweb3State = async ({ fweb3Faucet }: IFweb3Interfaces) => {
  return _contractSharedState(fweb3Faucet)
}

const _maticState = async ({ maticFaucet }: IFweb3Interfaces) => {
  const sharedState = await _contractSharedState(maticFaucet)
  const minFweb3Required = await maticFaucet.minFweb3Required()
  const minFweb3RequiredDecimals = await maticFaucet.minFweb3RequiredDecimals()
  return {
    ...sharedState,
    minFweb3Required: ethers.utils.formatEther(minFweb3Required.toString()),
    minFweb3RequiredDecimals: minFweb3RequiredDecimals.toNumber(),
  }
}

const _contractSharedState = async (contract: Contract) => {
  const dripAmount = await contract.dripAmount()
  const dripBase = await contract.dripBase()
  const dripDecimals = await contract.decimals()
  const disabled = await contract.faucetDisabled()
  const timeout = await contract.timeout()
  const singleUse = await contract.singleUse()
  const holderLimit = await contract.holderLimit()
  const useHolderLimit = await contract.useHolderLimit()
  return {
    dripAmount: ethers.utils.formatEther(dripAmount.toString()),
    dripDecimals: dripDecimals.toNumber(),
    disabled,
    timeout: timeout.toNumber(),
    singleUse,
    holderLimit: ethers.utils.formatEther(holderLimit.toString()),
    useHolderLimit,
    dripBase: dripBase.toNumber(),
  }
}
