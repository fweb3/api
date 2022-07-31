import { gql } from 'apollo-server-express'

const userSchema = gql`
  scalar Date

  enum Role {
    PLAYER
    ADMIN
    ROOT
  }

  type User {
    id: ID
    account: String
    displayName: String
    createdAt: Date
    updatedAt: Date
    email: String
    ens: String
    role: Role
    taskState: TaskState
  }

  type TaskState {
    hasUsedFweb3Faucet: Boolean
    hasUsedMaticFaucet: Boolean
    hasSentTokens: Boolean
    hasMintedDiamondNFT: Boolean
    hasBurnedTokens: Boolean
    hasSwappedTokens: Boolean
    hasVotedInPoll: Boolean
    hasDeployedContract: Boolean
    hasWonGame: Boolean
    trophyId: String
  }

  extend type Query {
    allUsers: [User!]
    findByAccount(account: String): User
  }

  extend type Mutation {
    createUser(account: String): User
    findOrCreateUser(account: String): User
  }
`

export { userSchema }
