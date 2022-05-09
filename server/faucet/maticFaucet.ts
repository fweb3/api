import { attemptTransactionWithGas } from './transact'
import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers'
import { formatError, IError } from './errors'
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
  const { provider, maticFaucet }: IFweb3Interfaces = interfaces

  const receipt: ContractReceipt = await attemptTransactionWithGas(
    interfaces,
    account,
    'matic'
  )

  const endBalance: BigNumber = await provider.getBalance(maticFaucet.address)

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
  try {
    const tx: ContractTransaction = await maticFaucet.drip(account)
    const receipt: ContractReceipt = await tx.wait()

    const endBalance: BigNumber = await provider.getBalance(maticFaucet.address)

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
