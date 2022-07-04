import { gql } from 'apollo-server-express'

const faucetSchema = gql`
  type BalanceData {
    tokenAddress: String
    faucetAddress: String
    tokenBalance: String
    maticBalance: String
    dripAmount: String
  }

  type Balances {
    fweb3: BalanceData
    matic: BalanceData
  }

  type Receipt {
    txHash: String
  }

  extend type Query {
    faucetBalance(network: String): Balances
  }

  extend type Mutation {
    disableFaucet(faucet: String, network: String): Receipt
    drainFaucet(faucet: String, network: String): Receipt
  }
`

export { faucetSchema }
