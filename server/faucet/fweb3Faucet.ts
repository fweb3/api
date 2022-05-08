import { attemptTransactionWithGas } from './transact'
import { BigNumber, ethers } from 'ethers'
import { getPrivk, getProvider, Provider } from './interfaces'
import { loadAbi, getContractAddress } from './contracts'
import { log } from '../logger'
import type { IFaucetBody } from './faucet'

export const useFweb3Faucet = async ({ network, account }: IFaucetBody) => {
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

const _developmentTransaction = async (
  tokenContract: ethers.Contract,
  faucetContract: ethers.Contract,
  account: string
) => {
  log.debug('[+] Running tx without gas estimator')
  const tx = await faucetContract.dripFweb3(account)
  const receipt = await tx.wait()

  const fweb3FaucetBalance: BigNumber = await tokenContract.balanceOf(
    faucetContract.address
  )

  log.debug({
    sent_fweb3_to: account,
    fweb3_faucet_balance: fweb3FaucetBalance.toString(),
    tx: receipt.transactionHash,
  })

  return receipt
}

const _gasEstimateTransaction = async (
  network: string,
  provider: Provider,
  contract: ethers.Contract,
  account: string,
  fweb3TokenContract: ethers.Contract
) => {
  log.debug('[+] Running tx with gas estimator')

  const receipt = await attemptTransactionWithGas(
    network,
    provider,
    contract.dripFweb3,
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
