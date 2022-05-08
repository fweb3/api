import { attemptTransactionWithGas } from './transact'
import { formatError, IError } from './errors'
import { BigNumber, ContractReceipt, ContractTransaction, ethers } from 'ethers'
import { getPrivk, getProvider, Provider } from './interfaces'
import { loadAbi, getContractAddress } from './contracts'
import { log } from '../logger'
import type { IFaucetBody } from './faucet'

export const useFweb3Faucet = async ({
  network,
  account,
}: IFaucetBody): Promise<ContractReceipt> => {
  log.debug(`[+] Initializing fweb3 faucet request on ${network}`)
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
  const fweb3TokenContract: ethers.Contract = new ethers.Contract(
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

  if (network === 'localhost') {
    return _developmentTransaction(
      fweb3TokenContract,
      fweb3FaucetContract,
      account
    )
  } else {
    return _gasEstimateTransaction(
      network,
      provider,
      fweb3FaucetContract,
      account,
      fweb3TokenContract
    )
  }
}
// Need catch to format local errors
const _developmentTransaction = async (
  tokenContract: ethers.Contract,
  faucetContract: ethers.Contract,
  account: string
) => {
  try {
    log.debug('[+] Running fweb3 faucet without gas estimator')

    const tx: ContractTransaction = await faucetContract.drip(account)
    const receipt: ContractReceipt = await tx.wait()

    const dripAmount: BigNumber = await faucetContract.dripAmount()
    const fweb3FaucetBalance: BigNumber = await tokenContract.balanceOf(
      faucetContract.address
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
  } catch (err) {
    const formattedError: IError = formatError(err)
    log.debug(JSON.stringify(formattedError, null, 2))
    throw formattedError
  }
}

const _gasEstimateTransaction = async (
  network: string,
  provider: Provider,
  contract: ethers.Contract,
  account: string,
  fweb3TokenContract: ethers.Contract
): Promise<ContractReceipt> => {
  log.debug('[+] Running fweb3 faucet with gas estimator')

  const receipt: Promise<ContractReceipt> = await attemptTransactionWithGas(
    network,
    provider,
    contract.drip,
    account.toString()
  )

  const fweb3FaucetBalance: BigNumber = await fweb3TokenContract.balanceOf(
    contract.address
  )

  log.debug({
    sent_fweb3_to: account,
    fweb3_faucet_balance: fweb3FaucetBalance.toString(),
    tx: receipt,
  })

  return receipt
}
