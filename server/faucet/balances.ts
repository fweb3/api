import { ethers } from 'ethers'
import { getFweb3Interfaces, IFweb3Interfaces } from '../interfaces'
import { log } from '../logger'
import { ERRORS } from '../errors/faucetErrors'

const ALLOWED_NETWORKS = ['localhost', 'mumbai', 'polygon']

export const fetchBalances = async (network: string, address: string) => {
  const fweb3Interfaces = await getFweb3Interfaces(network)
  try {
    if (!ALLOWED_NETWORKS.includes(network)) {
      throw new Error(ERRORS.BAD_NETWORK_TYPE)
    }
    if (!address && !network) {
      throw new Error(ERRORS.INVALID_REQUEST_PARAMS)
    }
    if (!address) {
      return fetchFaucetBalances(fweb3Interfaces)
    } else {
      return _fetchAccountBalances(fweb3Interfaces, address)
    }
  } catch (err) {
    console.error(err)
  }
}

export const fetchFaucetBalances = async (interfaces: IFweb3Interfaces) => {
  log.debug(`[+] Fetching faucet balances for: [${interfaces.network}]`)
  const balances = {
    fweb3: await fetchFweb3Faucetbalance(interfaces),
    matic: await fetchMaticFaucetBalance(interfaces),
  }
  log.debug(balances)
  return balances
}

export const fetchMaticFaucetBalance = async ({
  maticFaucet,
  provider,
}: IFweb3Interfaces) => {
  const maticFaucetBalance = await provider.getBalance(maticFaucet.address)
  const maticDrip = await maticFaucet.dripAmount()
  return {
    faucetAddress: maticFaucet.address,
    maticBalance: ethers.utils.formatEther(maticFaucetBalance.toString()),
    dripAmount: ethers.utils.formatEther(maticDrip.toString()),
  }
}

export const fetchFweb3Faucetbalance = async ({
  fweb3Faucet,
  fweb3Token,
  provider,
}: IFweb3Interfaces) => {
  const fweb3MaticBalance = await provider.getBalance(fweb3Faucet.address)
  const fweb3Balance = await fweb3Token.balanceOf(fweb3Faucet.address)
  const fweb3Drip = await fweb3Faucet.dripAmount()

  return {
    tokenAddress: fweb3Token.address,
    faucetAddress: fweb3Faucet.address,
    tokenBalance: ethers.utils.formatEther(fweb3Balance.toString()),
    maticBalance: ethers.utils.formatEther(fweb3MaticBalance.toString()),
    dripAmount: ethers.utils.formatEther(fweb3Drip.toString()),
  }
}

const _fetchAccountBalances = async (
  { provider, fweb3Token }: IFweb3Interfaces,
  address: string
) => {
  console.log(`[-] Fetching account balances for: [${address}]`)
  const accountBalance = await provider.getBalance(address)
  const tokenBalance = await fweb3Token.balanceOf(address)
  return {
    fweb3_balance: ethers.utils.formatEther(tokenBalance.toString()),
    matic_balance: ethers.utils.formatEther(accountBalance.toString()),
  }
}
