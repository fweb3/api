import { attemptTransaction } from './transact'
import { BigNumber, ethers } from 'ethers'
import { getPrivk, getProvider, Provider } from './interfaces'
import { loadAbi, getContractAddress } from './contracts'
import type { IFaucetBody } from './faucet'

export const useFweb3Faucet = async ({ network, account }: IFaucetBody) => {
  console.log(`[+] Initializing fweb3 faucet request on ${network}`)
  const privk: string = getPrivk(network.toString())

  if (!privk) {
    throw new Error('cannot load wallet')
  }

  const provider: Provider = await getProvider(network.toString())
  const wallet: ethers.Wallet = await new ethers.Wallet(privk || '', provider)

  const fweb3TokenAddress: string = getContractAddress(
    network.toString(),
    'fweb3Token'
  )
  const fweb3TokenAbi: ethers.ContractInterface = loadAbi('fweb3Token')
  const fweb3TokenContract = new ethers.Contract(
    fweb3TokenAddress,
    fweb3TokenAbi,
    wallet
  )

  const fweb3FaucetAddress: string = getContractAddress(
    network.toString(),
    'fweb3TokenFaucet'
  )
  const fweb3FaucetAbi: ethers.ContractInterface = loadAbi('fweb3TokenFaucet')
  const fweb3FaucetContract = new ethers.Contract(
    fweb3FaucetAddress,
    fweb3FaucetAbi,
    wallet
  )

  const receipt: ethers.ContractReceipt = await attemptTransaction(
    provider,
    network.toString(),
    fweb3FaucetContract.dripFweb3,
    account.toString()
  )

  if (!receipt) {
    throw new Error('Network is congested. Please try again later')
  }

  const fweb3FaucetBalance: BigNumber = await fweb3TokenContract.balanceOf(
    fweb3FaucetContract.address
  )

  console.log({
    sent_fweb3_to: account,
    fweb3_faucet_balance: fweb3FaucetBalance.toString(),
    tx: receipt.transactionHash,
  })

  return receipt
}
