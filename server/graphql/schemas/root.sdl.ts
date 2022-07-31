import { gql } from 'apollo-server-express'

const rootSchema = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`

export { rootSchema }
