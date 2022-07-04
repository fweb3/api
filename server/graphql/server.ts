import { ApolloServer } from 'apollo-server-express'
import { resolvers } from './resolvers'
import { schema } from './schema'

const createApolloServer = async (app) => {
  const server = new ApolloServer({
    typeDefs: schema,
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
