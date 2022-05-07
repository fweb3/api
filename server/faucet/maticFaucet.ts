import { attemptTransactionWithGas } from './transact'
import { ethers } from 'ethers'
import { getPrivk, getProvider, Provider } from './interfaces'
import { loadAbi, getContractAddress } from './contracts'
import type { IFaucetBody } from './faucet'
import { log } from '../logger'

export const useMaticFaucet = async ({ network, account }: IFaucetBody) => {
  log.debug(`[+] Initializing matic faucet request on ${network}`)
  const privk = getPrivk(network.toString())

  if (!privk) {
    throw new Error('cannot load wallet')
  }

  const provider = await getProvider(network.toString())
  const wallet = new ethers.Wallet(privk || '', provider)

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

  if (network === 'local') {
    return _localTransaction(provider, maticFaucetContract, account.toString())
  } else {
    return _gasEstimatedTransaction(
      network,
      provider,
      maticFaucetContract,
      account.toString()
    )
  }
}

const _gasEstimatedTransaction = async (
  network: string,
  provider: Provider,
  contract: ethers.Contract,
  account: string
) => {
  const receipt = await attemptTransactionWithGas(
    network,
    provider,
    contract.dripMatic,
    account
  )

  const endBalance = await provider.getBalance(contract.address)

  log.debug({
    sent_matic_to: account,
    matic_faucet_end_balance: endBalance.toString(),
    tx_receipt: receipt,
  })

  return receipt
}

const _localTransaction = async (
  provider: Provider,
  contract: ethers.Contract,
  account: string
) => {
  const tx = await contract.dripMatic(account)
  const receipt = await tx.wait()

  const endBalance = await provider.getBalance(contract.address)

  log.debug({
    sent_matic_to: account,
    matic_faucet_end_balance: endBalance.toString(),
    tx_receipt: receipt,
  })

  return receipt
}
