export interface IPolygonResult {
  nonce?: string
  blockHash?: string
  transactionIndex?: string
  gasPrice?: string
  txreceipt_status?: string
  cumulativeGasUsed?: string
  confirmations?: string
  blockNumber: string
  timestamp: string
  hash: string
  from: string
  to: string
  value: string
  contractAddress: string
  input: string
  type: string
  gas: string
  gasUsed: string
  traceId: string
  isError: string
  errCode: string
  tokenID?: string
}

export interface IPolygonResponse {
  status: string
  message: string
  result: IPolygonResult[]
}
