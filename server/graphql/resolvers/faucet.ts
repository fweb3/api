import { fetchFaucetBalances, disableFaucet, drainFaucet } from '../../faucet'
import { getFweb3Interfaces } from '../../interfaces'

const faucetResolver = {
  Query: {
    faucetBalance: async (root, { network }) => {
      const interfaces = await getFweb3Interfaces(network)
      return fetchFaucetBalances(interfaces)
    },
  },
  Mutation: {
    setDisableFaucet: disableFaucet,
    drainFaucet,
  },
}

export { faucetResolver }
