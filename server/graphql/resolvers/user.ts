import { UserService } from '../service'

const userResolver = {
  Query: {
    allUsers: () => UserService.all(),
    findByAccount: (root, { account }) => UserService.find(account),
  },
  Mutation: {
    createUser: (root, { account }) => UserService.create(account),
    findOrCreateUser: (root, { account }) => UserService.findOrCreate(account),
  },
}

export { userResolver }
