import { attemptTransaction } from './transact'
import { ethers } from 'ethers'
import { getPrivk, getProvider } from './interfaces'
import { loadAbi, getContractAddress } from './contracts'
import type { IFaucetBody } from './faucet'

export const useMaticFaucet = async ({ network, account }: IFaucetBody) => {
  console.log(`[+] Initializing matic faucet request on ${network}`)
  const privk = getPrivk(network.toString())

  if (!privk) {
    throw new Error('cannot load wallet')
  }

  const provider = await getProvider(network.toString())
  const wallet = await new ethers.Wallet(privk || '', provider)

  const maticFaucetAddress = getContractAddress(
    network.toString(),
    'fweb3MaticFaucet'
  )
  const maticFaucetAbi = loadAbi('fweb3MaticFaucet')
  const maticFaucetContract = new ethers.Contract(
    maticFaucetAddress,
    maticFaucetAbi,
    wallet
  )

  const receipt = await attemptTransaction(
    provider,
    network.toString(),
    maticFaucetContract.dripMatic,
    account.toString()
  )

  if (!receipt) {
    throw new Error('Gas prices are too high. Please try again later')
  }

  const endBalance = await provider.getBalance(maticFaucetAddress)

  console.log({
    sent_matic_to: account,
    matic_faucet_end_balance: endBalance.toString(),
    tx_receipt: receipt,
  })

  return receipt
}
