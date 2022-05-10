import { attemptTransactionWithGas } from './transact'
import { BigNumber, ContractReceipt, ContractTransaction, ethers } from 'ethers'
import { ERRORS } from './errors'
import { getFweb3Interfaces, IFweb3Interfaces } from '../interfaces'
import { log } from '../logger'
import type { IFaucetBody } from './faucet'

export const useFweb3Faucet = async ({
  network,
  account,
}: IFaucetBody): Promise<ContractReceipt> => {
  log.debug(`[+] Initializing fweb3 faucet request on ${network}`)
  const fweb3Interfaces = await getFweb3Interfaces(network)
  if (network === 'localhost') {
    return _developmentTransaction(fweb3Interfaces, account)
  } else {
    return _gasEstimateTransaction(fweb3Interfaces, account)
  }
}

const _developmentTransaction = async (
  { fweb3Faucet }: IFweb3Interfaces,
  account: string
) => {
  log.debug('[+] Running fweb3 faucet without gas estimator')

  const tx: ContractTransaction = await fweb3Faucet.drip(account)
  const receipt: ContractReceipt = await tx.wait()
  if (!receipt) {
    throw new Error(ERRORS.ERROR_NO_RECEIPT)
  }
  const dripAmount: BigNumber = await fweb3Faucet.dripAmount()
  const fweb3FaucetBalance: BigNumber = await fweb3Faucet.balanceOf(
    fweb3Faucet.address
  )

  log.debug({
    sent_fweb3_to: account,
    drip_amount: ethers.utils.formatEther(dripAmount.toString()),
    fweb3_faucet_balance: ethers.utils.formatEther(
      fweb3FaucetBalance.toString()
    ),
    tx: receipt.transactionHash,
  })

  return receipt
}

const _gasEstimateTransaction = async (
  fweb3Interface,
  address
): Promise<ContractReceipt> => {
  log.debug('[+] Running fweb3 faucet with gas estimator')

  const receipt: Promise<ContractReceipt> = await attemptTransactionWithGas(
    fweb3Interface,
    address,
    'fweb3'
  )
  if (!receipt) {
    throw new Error(ERRORS.ERROR_NO_RECEIPT)
  }
  const fweb3FaucetBalance: BigNumber =
    await fweb3Interface.fweb3Token.balanceOf(fweb3Interface.fweb3Token.address)

  log.debug({
    sent_fweb3_to: address,
    fweb3_faucet_balance: fweb3FaucetBalance.toString(),
    tx: receipt,
  })

  return receipt
}
