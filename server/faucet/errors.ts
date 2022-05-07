export interface IErrors {
  type: string
  match?: string
  message: string
  additional?: IErrors[]
  raw?: Record<string, unknown>
}

const ERROR_MAP: IErrors[] = [
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
    match: 'execution reverted: missing erc20',
    message: 'You do not have enough fweb3 to use the faucet.',
  },
  {
    type: 'ERROR_CONTRACT_FWEB3_LIMIT',
    match: 'execution reverted: limit',
    message: 'Wallet has enough fweb3.',
  },
  {
    type: 'ERROR_CONTRACT_FAUCET_USED',
    match: 'execution reverted: used',
    message: 'Wallet already used. Faucet is single use.',
  },
  {
    type: 'ERROR_CONTRACT_TOO_EARLY',
    match: 'execution reverted: timeout',
    message: 'Too early for another drip.',
  },
  {
    type: 'ERROR_CONTRACT_ALREADY_ENOUGH_MATIC',
    match: 'execution reverted: no need',
    message: 'You already have more than enough MATIC.',
  },
  {
    type: 'ERROR_CONTRACT_FAUCET_DISABLED',
    match: 'execution reverted: disabled',
    message: 'Faucet is disabled.',
  },
  {
    type: 'ERROR_CONTRACT_FAUCET_DRY',
    match: 'execution reverted: dry',
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
    type: 'ERROR_TX_FAILED',
    match: 'send failed',
    message: 'TX failed to send.',
  },
  {
    type: 'ERROR_EXECUTION_REVERTED',
    match: 'may require manual gas limit',
    message: 'Likely a contract related error occured.',
  },
  {
    type: 'ERROR_GENERIC',
    match: '',
    message: 'An unknown error occured.',
  },
]

export const formatError = (err): IErrors => {
  const rpcErrorJson = JSON.parse(err.error?.error?.body)
  const contractError = rpcErrorJson?.error?.message
  const possibleErrors = ERROR_MAP.filter((e) =>
    contractError.includes(e.match)
  )
  if (possibleErrors.length === 1) {
    return possibleErrors[0]
  }
  const [first, ...additional] = possibleErrors
  return {
    type: first.type,
    message: first.message,
    additional,
    raw: err,
  }
}
