import { getFweb3Interfaces } from '../../interfaces'
import { fetchFaucetBalances, disableFaucet, drainFaucet } from '../../faucet'

const faucetResolver = {
  Query: {
    faucetBalance: async (root, { network = 'polygon' }) => {
      const interfaces = await getFweb3Interfaces(network)
      return fetchFaucetBalances(interfaces)
    },
  },
  Mutation: {
    disableFaucet: async (root, { faucet = 'fweb3', network = 'mumbai' }) => {
      const interfaces = await getFweb3Interfaces(network)
      return disableFaucet(faucet, interfaces)
    },
    drainFaucet: async (root, { faucet = 'fweb3', network = 'mumbai' }) => {
      const interfaces = await getFweb3Interfaces(network)
      return drainFaucet(faucet, interfaces)
    },
  },
}

export { faucetResolver }
