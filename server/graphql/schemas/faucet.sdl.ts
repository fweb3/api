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

  type DisableResponse {
    status: String
    receipt: String
    transactionHash: String
  }

  type DrainResponse {
    status: String
    receipt: [String]
    transactionHash: [String]
  }

  extend type Query {
    faucetBalance(network: String): Balances
  }

  extend type Mutation {
    setDisableFaucet(
      faucet: String!
      network: String!
      val: Boolean!
    ): DisableResponse
    drainFaucet(
      reciepient: String!
      faucet: String!
      network: String!
      kind: String!
    ): DrainResponse
  }
`

export { faucetSchema }
