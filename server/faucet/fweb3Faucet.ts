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

  if (network !== 'polygon') {
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
      account
    )
  }
}

const _developmentTransaction = async (
  tokenContract: ethers.Contract,
  faucetContract: ethers.Contract,
  account: string
) => {
  const tx = await faucetContract.dripFweb3(account)
  const receipt = await tx.wait()

  if (!receipt) {
    throw new Error('Network is congested. Please try again later')
  }

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
  account: string
) => {
  const receipt = await attemptTransactionWithGas(
    network,
    provider,
    contract.dripFweb3,
    account.toString()
  )

  if (!receipt) {
    throw new Error('Network is congested. Please try again later')
  }

  const fweb3FaucetBalance: BigNumber = await contract.balanceOf(
    contract.address
  )

  log.debug({
    sent_fweb3_to: account,
    fweb3_faucet_balance: fweb3FaucetBalance.toString(),
    tx: receipt,
  })

  return receipt
}
