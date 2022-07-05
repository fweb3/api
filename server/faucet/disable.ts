import { getFweb3Interfaces } from './../interfaces'
import { IFaucetTXResponse } from './faucet.d'
import { log } from './../logger'

type DisableReceipt = Promise<Record<string, unknown>>

const _setDisableFweb3Faucet = async (
  network: string,
  val: boolean
): DisableReceipt => {
  const { fweb3Faucet } = await getFweb3Interfaces(network)
  const tx = await fweb3Faucet.setDisableFaucet(val)
  const receipt = await tx.wait()
  return receipt
}

export const _setDisableMaticFaucet = async ({
  network,
  val,
}): DisableReceipt => {
  const { maticFaucet } = await getFweb3Interfaces(network)
  const tx = await maticFaucet.setDisableFaucet(val)
  const receipt = await tx.wait()
  return receipt
}

const DISABLE_MAP = {
  fweb3: _setDisableFweb3Faucet,
  matic: _setDisableMaticFaucet,
}

const _allowMitigation = () => process.env.NODE_ENV === 'local'

export const disableFaucet = async (
  root,
  { faucet, ...rest }
): Promise<IFaucetTXResponse> => {
  try {
    if (!_allowMitigation()) {
      return {
        status: 'not_allowed',
        receipt: null,
        transactionHash: null,
      }
    }
    const receipt = await DISABLE_MAP[faucet](rest)
    return {
      status: 'ok',
      receipt: [JSON.stringify(receipt)],
      transactionHash: [receipt.transactionHash],
    }
  } catch (err) {
    log.error(err)
    return {
      status: 'error',
      transactionHash: null,
      receipt: null,
    }
  }
}
