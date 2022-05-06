import { ethers } from 'ethers'
import { getContractAddress } from './contracts/addresses'
import { getPrivk, getProvider } from './interfaces'
import { loadAbi } from './contracts/abi'
import { log } from '../logger'

export const fetchFaucetBalances = async (network: string) => {
  if (!network) {
    throw new Error('missing params')
  }

  const fweb3FaucetAddress = getContractAddress(
    network.toString(),
    'fweb3TokenFaucet'
  )
  const provider = getProvider(network.toString())
  const privk = getPrivk(network.toString()) || ''
  const wallet = new ethers.Wallet(privk, provider)

  const fweb3TokenAddress = getContractAddress(network.toString(), 'fweb3Token')
  const maticFaucetAddress = getContractAddress(
    network.toString(),
    'fweb3MaticFaucet'
  )
  const fweb3FaucetAbi = loadAbi('fweb3TokenFaucet')
  const fweb3TokenAbi = loadAbi('fweb3Token')
  const maticFaucetAbi = loadAbi('fweb3MaticFaucet')

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

  log.debug('[+] fetching balances...')
  log.debug(`[+] fweb3 token address: [${fweb3TokenAddress}]`)
  log.debug(`[+] fweb3 faucet address: [${fweb3FaucetAddress}]`)
  log.debug(`[+] matic faucet address: [${maticFaucetAddress}]`)

  const fweb3Drip = await fweb3Faucet.dripAmount()
  log.debug(`[+] fweb3_faucet_drip: ${fweb3Drip}`)

  const fweb3Balance = await fweb3Token.balanceOf(fweb3FaucetAddress)
  log.debug(`[+] fweb3_faucet_balance: ${fweb3Balance}`)

  const fweb3MaticBalance = await provider.getBalance(fweb3FaucetAddress)
  log.debug(`[+] fweb3_faucet_matic: ${fweb3MaticBalance}`)

  const maticDrip = await maticFaucet.dripAmount()
  log.debug(`[+] matic_faucet_drip: ${maticDrip}`)

  const maticFaucetBalance = await provider.getBalance(maticFaucetAddress)
  log.debug(`[+] matic_faucet_balance: ${maticFaucetBalance}`)

  return {
    fweb3: {
      token_balance: ethers.utils.formatEther(fweb3Balance.toString()),
      matic_balance: ethers.utils.formatEther(fweb3MaticBalance.toString()),
      drip_amount: ethers.utils.formatEther(fweb3Drip.toString()),
    },
    matic: {
      matic_balance: ethers.utils.formatEther(maticFaucetBalance.toString()),
      drip_amount: ethers.utils.formatEther(maticDrip.toString()),
    },
  }
}
