import { rootSchema } from './root.sdl'
import { userSchema } from './user.sdl'
import { faucetSchema } from './faucet.sdl'
const typeDefs = [rootSchema, userSchema, faucetSchema]

export { typeDefs }
