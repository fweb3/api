import { attemptTransaction } from './transact'
import { ethers } from 'ethers'
import { getPrivk, getProvider, Provider } from './interfaces'
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

  if (network !== 'polygon') {
    return _developmentTransaction(
      provider,
      maticFaucetContract,
      account.toString()
    )
  } else {
    return _mainnetTransaction(
      provider,
      maticFaucetContract,
      account.toString()
    )
  }
}

const _mainnetTransaction = async (
  provider: Provider,
  contract: ethers.Contract,
  account: string
) => {
  const receipt = await attemptTransaction(provider, contract, account)

  if (!receipt) {
    throw new Error('Gas prices are too high. Please try again later')
  }

  const endBalance = await provider.getBalance(contract.address)

  console.log({
    sent_matic_to: account,
    matic_faucet_end_balance: endBalance.toString(),
    tx_receipt: receipt,
  })

  return receipt
}

const _developmentTransaction = async (
  provider: Provider,
  contract: ethers.Contract,
  account: string
) => {
  const tx = await contract.dripMatic(account)
  const receipt = await tx.wait()

  if (!receipt) {
    throw new Error('Gas prices are too high. Please try again later')
  }

  const endBalance = await provider.getBalance(contract.address)

  console.log({
    sent_matic_to: account,
    matic_faucet_end_balance: endBalance.toString(),
    tx_receipt: receipt,
  })

  return receipt
}
