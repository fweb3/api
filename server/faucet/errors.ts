const { DEBUG_LOG = 'true' } = process.env

export interface IError {
  status?: string
  type: string
  match?: string
  message: string
  error?: string
}

export const ERRORS: Record<string, string> = {
  INVALID_REQUEST_PARAMS: 'Invalid request params',
  BAD_NETWORK_TYPE: 'Network is not supported',
  NO_RECEIPT_ERROR: 'No receipt for tx. Try again in a few.',
  ERROR_GENERIC: 'An unknown error occured',
  EXAHUSTED_ATTEMPTS: 'All attempts to transact have failed. Try again',
  ERROR_GETTING_ESTIMATED_GAS: 'Cannot estimate gas',
}

const ERROR_MAP: IError[] = [
  {
    type: 'ERROR_WALLET_LOAD',
    match: 'cannot load wallet',
    message: 'Cannot load signers wallet.',
  },
  {
    type: 'ERROR_ALCHEMY_WHITELIST',
    match: 'Unspecified origin not on whitelist',
    message: 'domain not whitelisted on alchemy.',
  },
  {
    type: 'ERROR_GAS_BLOCK_GAS_LIMIT',
    match: 'exceeds block gas limit',
    message: 'TX exceeds the current block gas limit.',
  },
  {
    type: 'ERROR_CONTRACT_MISSING_REQUIRED_TOKEN',
    match: 'MISSING_FWEB3_TOKENS',
    message: 'You do not have enough fweb3 to use the faucet.',
  },
  {
    type: 'ERROR_CONTRACT_FWEB3_LIMIT',
    match: 'FWEB3_WALLET_LIMIT',
    message: 'Wallet has enough fweb3.',
  },
  {
    type: 'ERROR_CONTRACT_FAUCET_USED',
    match: 'SINGLE_USE',
    message: 'Wallet already used. Faucet is single use.',
  },
  {
    type: 'ERROR_CONTRACT_TOO_EARLY',
    match: 'WALLET_TIMEOUT',
    message: 'Too early for another drip.',
  },
  {
    type: 'ERROR_CONTRACT_ALREADY_ENOUGH_MATIC',
    match: 'HOLDER_LIMIT',
    message: 'You already have more than enough MATIC.',
  },
  {
    type: 'ERROR_CONTRACT_FAUCET_DISABLED',
    match: 'FAUCET_DISABLED',
    message: 'Faucet is disabled.',
  },
  {
    type: 'ERROR_CONTRACT_TX_FAILURE',
    match: 'TX_FAILURE',
    message: 'Faucet TX failed internally.',
  },
  {
    type: 'ERROR_CONTRACT_FAUCET_DRY',
    match: '_DRY',
    message: 'Faucet is out of required funds.',
  },
  {
    type: 'ERROR_GAS_REQUIRED_EXCEEDS_LIMIT',
    match: 'gas required exceeds allowance',
    message: 'Gas is more than set allowance',
  },
  {
    type: 'ERROR_GAS_TX_UNDERPRICED',
    match: 'transaction underpriced',
    message: 'Gas attempted was underpriced.',
  },
  {
    type: 'ERROR_GAS_LESS_THAN_BASE_FEE',
    match: 'max fee per gas less than block base fee',
    message: 'Max fee per gas less than base fee.',
  },
  {
    type: 'ERROR_GAS_TOO_LOW',
    match: 'is too low for the next block',
    message: 'Gas price too low.',
  },
  {
    type: 'ERROR_GENERIC',
    match: ERRORS.ERROR_GENERIC,
    message: 'An unknown error occured.',
  },
  {
    type: 'ERROR_NO_RECEIPT',
    match: ERRORS.NO_RECEIPT_ERROR,
    message: 'An unknown error occured.',
  },
]

export const hasGasRelatedError = (err): boolean => {
  const formattedError = formatError(err)
  return formattedError.type.includes('GAS')
}

export const formatError = (err): IError => {
  const possibleErrors = ERROR_MAP.filter((e) => err.message.includes(e.match))
  if (possibleErrors.length === 0) {
    return {
      status: 'error',
      type: 'UNKNOWN_ERROR',
      message: ERRORS.ERROR_GENERIC,
      ...(DEBUG_LOG ? { error: err.message } : {}),
    }
  }
  return {
    status: 'error',
    type: possibleErrors[0].type,
    message: possibleErrors[0].message,
    ...(DEBUG_LOG ? { error: err.message } : {}),
  }
}
