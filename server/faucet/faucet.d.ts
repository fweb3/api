export interface IFaucetBody {
  network: string
  type: string
  account: string
}

export interface IFaucetTXResponse {
  status: string
  receipt: string[]
  transactionHash: string[]
}
