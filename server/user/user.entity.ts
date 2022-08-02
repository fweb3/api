import { prisma } from '../../prisma'

export async function getUser(account: string) {
  try {
    return prisma.user.findUnique({ where: { account } })
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function createUser(data) {
  try {
    return prisma.user.create({ data })
  } catch (err) {
    console.error(err)
    return null
  }
}
