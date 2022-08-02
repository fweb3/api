import { prisma } from '../../prisma'
import { IUser } from './user.d'

export async function getUser(account: string): Promise<IUser> {
  try {
    return prisma.user.findUnique({
      where: { account },
      include: {
        ipinfo: true,
        twitter: true,
      },
    })
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
