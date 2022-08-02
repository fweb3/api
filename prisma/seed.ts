import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const Role: { [x: string]: 'PLAYER' | 'ADMIN' | 'ROOT' } = {
  PLAYER: 'PLAYER',
  ADMIN: 'ADMIN',
  ROOT: 'ROOT',
}

type Role = typeof Role[keyof typeof Role]

const SEED_USERS = [
  {
    account: 'polygon:0xb15A3D29eFe51baaC8d3cd2f4F747B843FeAdA7d',
    email: 'thefakeryan@icloud.com',
    role: Role.ROOT,
    ens: 'rimraf.eth',
  },
  {
    account: 'polygon:0x65eaFA1FBA16E3D85Ea9e663794e4F6e123C4B8A',
    email: 'ryan@sudormrf.me',
    role: Role.ADMIN,
    ens: 'foo.eth',
  },
  {
    account: 'polygon:0xeFA27c8CD1b31B3ACc72ba814ff8B16258f837F9',
    email: 'faucet-test1@me.me',
    role: Role.PLAYER,
    ens: 'bar.eth',
  },
]

;(async () => {
  try {
    const promises = SEED_USERS.map((user) =>
      prisma.user.create({ data: user })
    )
    return Promise.all(promises)
  } catch (err) {
    console.error(err.message)
    return null
  }
})()
