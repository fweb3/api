import { Contract, ContractReceipt } from '@ethersproject/contracts'
import { getFweb3Interfaces } from '../interfaces'
import type { IFaucetTXResponse } from './faucet.d'

interface IDrainArgs {
  reciepient: string
  faucet: string
  fweb3Faucet?: Contract
  maticFaucet?: Contract
  network: string
  kind: string
}

const _drainMaticFaucet = async (drainArgs) => {
  const receipt = await _drainMaticFromMaticFaucet(drainArgs)
  return {
    status: 'ok',
    receipt: [JSON.stringify(receipt)],
    transactionHash: [receipt.transactionHash],
  }
}

const _drainMaticFromMaticFaucet = async ({
  reciepient,
  maticFaucet,
}: IDrainArgs): Promise<ContractReceipt> => {
  const tx = await maticFaucet.drain(reciepient)
  const receipt = await tx.wait()
  return receipt
}

const _drainFweb3Tokens = async ({
  reciepient,
  fweb3Faucet,
}: IDrainArgs): Promise<ContractReceipt> => {
  const tx = await fweb3Faucet.drainFweb3(reciepient)
  const receipt = await tx.wait()
  return receipt
}

const _drainMaticFromFweb3Faucet = async ({
  reciepient,
  fweb3Faucet,
}: IDrainArgs): Promise<ContractReceipt> => {
  try {
    const tx = await fweb3Faucet.drain(reciepient)
    const receipt = await tx.wait()
    return receipt
  } catch (err) {
    console.error(err.message)
    return null
  }
}

const _drainAllFromFweb3Faucet = async (
  drainArgs: IDrainArgs
): Promise<IFaucetTXResponse> => {
  try {
    const drainFweb3Receipt = await _drainFweb3Tokens(drainArgs)
    const drainMaticReceipt = await _drainMaticFromFweb3Faucet(drainArgs)

    return {
      status: 'ok',
      receipt: [
        JSON.stringify(drainFweb3Receipt),
        JSON.stringify(drainMaticReceipt),
      ],
      transactionHash: [
        drainFweb3Receipt.transactionHash,
        drainMaticReceipt.transactionHash,
      ],
    }
  } catch (err) {
    console.error(err.message)
    return {
      status: 'error',
      receipt: null,
      transactionHash: null,
    }
  }
}

const _drainAll = async (drainArgs) => {
  try {
    const fweb3Res = await _drainAllFromFweb3Faucet(drainArgs)
    const maticRes = await _drainMaticFaucet(drainArgs)
    return {
      status: 'ok',
      receipts: [...fweb3Res.receipt, ...maticRes.receipt],
      transactionHashes: [
        ...fweb3Res.transactionHash,
        ...maticRes.transactionHash,
      ],
    }
  } catch (err) {
    return {
      status: 'error',
      receipts: [],
      transactionHashes: [],
    }
  }
}

const DRAIN_MAP = {
  fweb3_all: _drainAllFromFweb3Faucet,
  fweb3_token: _drainFweb3Tokens,
  fweb3_matic: _drainMaticFromFweb3Faucet,
  matic: _drainMaticFaucet,
  matic_all: _drainMaticFaucet,
  all_all: _drainAll,
}

export const drainFaucet = async (
  root,
  { reciepient, faucet, network, kind }: IDrainArgs
): Promise<IFaucetTXResponse> => {
  const kinds = ['fweb3', 'matic', 'all']
  const canDrain = kinds.includes(kind)

  if (!canDrain) {
    throw new Error('there was an error draining faucets')
  }

  const drainSlug = `${faucet}_${kind}`
  const { maticFaucet, fweb3Faucet } = await getFweb3Interfaces(network)
  const payload = await DRAIN_MAP[drainSlug]({
    reciepient,
    maticFaucet,
    fweb3Faucet,
  })
  return payload
}
