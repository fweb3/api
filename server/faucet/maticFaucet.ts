import { formatError, IError } from './errors'
import { attemptTransactionWithGas } from './transact'
import { getPrivk, getProvider, Provider } from './interfaces'
import { loadAbi, getContractAddress } from './contracts'
import type { IFaucetBody } from './faucet'
import { log } from '../logger'
import {
  BigNumber,
  ContractReceipt,
  ContractTransaction,
  ethers,
  Wallet,
} from 'ethers'

export const useMaticFaucet = async ({
  network,
  account,
}: IFaucetBody): Promise<ContractReceipt> => {
  log.debug(`[+] Initializing matic faucet request on ${network}`)
  const privk: string = getPrivk(network.toString())

  if (!privk) {
    throw new Error('cannot load wallet')
  }

  const provider: Provider = await getProvider(network.toString())
  const wallet: Wallet = new ethers.Wallet(privk || '', provider)

  const maticFaucetAddress: string = getContractAddress(
    network.toString(),
    'fweb3MaticFaucet'
  )

  const maticFaucetAbi: string = loadAbi('fweb3MaticFaucet')
  const maticFaucetContract = new ethers.Contract(
    maticFaucetAddress,
    maticFaucetAbi,
    wallet
  )

  if (network === 'localhost') {
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
): Promise<ContractReceipt> => {
  const receipt: ContractReceipt = await attemptTransactionWithGas(
    network,
    provider,
    contract.drip,
    account
  )

  const endBalance: BigNumber = await provider.getBalance(contract.address)

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
): Promise<ContractReceipt> => {
  try {
    const tx: ContractTransaction = await contract.drip(account)
    const receipt: ContractReceipt = await tx.wait()

    const endBalance: BigNumber = await provider.getBalance(contract.address)

    log.debug({
      sent_matic_to: account,
      matic_faucet_end_balance: endBalance.toString(),
      tx_receipt: receipt,
    })

    return receipt
  } catch (err) {
    const formattedError: IError = formatError(err)
    log.debug(JSON.stringify(formattedError, null, 2))
    throw formatError
  }
}
