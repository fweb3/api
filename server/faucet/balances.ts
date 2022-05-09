import { ethers } from 'ethers'
import { getFweb3Interfaces, IFweb3Interfaces } from './interfaces'
import { log } from '../logger'

const ALLOWED_NETWORKS = ['localhost', 'mumbai', 'polygon']

export const fetchBalances = async (network: string, address: string) => {
  const fweb3Interfaces = await getFweb3Interfaces(network)
  try {
    if (!ALLOWED_NETWORKS.includes(network)) {
      throw new Error('Unsupported network')
    }
    if (!address && !network) {
      throw new Error('Missing params')
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

export const fetchFaucetBalances = async ({
  fweb3Faucet,
  fweb3Token,
  maticFaucet,
  provider,
  network,
}: IFweb3Interfaces) => {
  log.debug(`[+] Fetching faucet balances for: [${network}]`)

  const maticFaucetBalance = await provider.getBalance(maticFaucet.address)
  const fweb3MaticBalance = await provider.getBalance(fweb3Faucet.address)
  const fweb3Balance = await fweb3Token.balanceOf(fweb3Faucet.address)
  const fweb3Drip = await fweb3Faucet.dripAmount()
  const maticDrip = await maticFaucet.dripAmount()

  const balances = {
    fweb3: {
      token_address: fweb3Token.address,
      faucet_address: fweb3Faucet.address,
      token_balance: ethers.utils.formatEther(fweb3Balance.toString()),
      matic_balance: ethers.utils.formatEther(fweb3MaticBalance.toString()),
      drip_amount: ethers.utils.formatEther(fweb3Drip.toString()),
    },
    matic: {
      faucet_address: maticFaucet.address,
      matic_balance: ethers.utils.formatEther(maticFaucetBalance.toString()),
      drip_amount: ethers.utils.formatEther(maticDrip.toString()),
    },
  }

  log.debug(balances)
  return balances
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
