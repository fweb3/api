import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const Role: { [x: string]: 'PLAYER' | 'ADMIN' | 'ROOT' } = {
  PLAYER: 'PLAYER',
  ADMIN: 'ADMIN',
  ROOT: 'ROOT',
}

type Role = typeof Role[keyof typeof Role]

const users = [
  {
    account: 'foo',
    displayName: 'foobarbaz',
    email: 'foo@bar.com',
    role: Role.PLAYER,
    ens: 'foo.eth',
  },
  {
    account: 'adminaccountwallet',
    displayName: 'teapot',
    email: 'admin@bar.com',
    role: Role.ADMIN,
    ens: 'admin.eth',
    taskState: {
      create: {
        hasWonGame: true,
        trophyId: '1',
      },
    },
  },
  {
    account: 'rootaccountwallet',
    displayName: 'sudoyou',
    email: 'root@bar.com',
    role: Role.ROOT,
    ens: 'root.eth',
  },
]

;(async () => {
  try {
    const promises = users.map((user) => prisma.user.create({ data: user }))
    Promise.all(promises)
  } catch (err) {
    console.error(err.message)
  }
})()
