import { attemptDripTransactionWithGas } from './transact'
import { ContractReceipt } from 'ethers'
import { ERRORS } from '../errors/faucetErrors'
import { getFweb3Interfaces, IFweb3Interfaces } from '../interfaces'
import { log } from '../logger'
import type { IFaucetBody } from './faucet'

export const useMaticFaucet = async ({
  network,
  account,
}: IFaucetBody): Promise<ContractReceipt> => {
  log.debug(`[+] Initializing matic faucet request on ${network}`)
  const fweb3Interfaces = await getFweb3Interfaces(network)

  if (network === 'localhost') {
    return _localTransaction(fweb3Interfaces, account)
  } else {
    return _gasEstimatedTransaction(fweb3Interfaces, account)
  }
}

const _gasEstimatedTransaction = async (
  interfaces: IFweb3Interfaces,
  account: string
): Promise<ContractReceipt> => {
  const { provider, maticFaucet } = interfaces

  const receipt = await attemptDripTransactionWithGas(
    interfaces,
    account,
    'matic'
  )
  if (!receipt) {
    throw new Error(ERRORS.ERROR_NO_RECEIPT)
  }
  const endBalance = await provider.getBalance(maticFaucet.address)

  log.debug({
    sent_matic_to: account,
    matic_faucet_end_balance: endBalance.toString(),
    tx_receipt: receipt,
  })

  return receipt
}

const _localTransaction = async (
  { maticFaucet, provider }: IFweb3Interfaces,
  account: string
): Promise<ContractReceipt> => {
  const tx = await maticFaucet.drip(account)
  const receipt = await tx.wait()

  if (!receipt) {
    throw new Error(ERRORS.ERROR_NO_RECEIPT)
  }

  const endBalance = await provider.getBalance(maticFaucet.address)

  log.debug({
    sent_matic_to: account,
    matic_faucet_end_balance: endBalance.toString(),
    tx_receipt: receipt,
  })

  return receipt
}
