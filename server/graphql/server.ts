import { ApolloServer } from 'apollo-server-express'
import { resolvers } from './resolvers'
import { typeDefs } from './schemas'

const createApolloServer = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    debug: true,
    csrfPrevention: true,
    cache: 'bounded',
  })
  await server.start()
  server.applyMiddleware({ app, path: '/api/graphql' })
  return server
}

export { createApolloServer }
