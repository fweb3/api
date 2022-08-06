import { prisma } from '../../prisma'
import { IUser } from './user.d'

export async function getUser(account: string): Promise<IUser> {
  try {
    const data = await prisma.user.findUnique({
      where: {
        account,
      },
      include: {
        ipinfo: true,
        twitter: true,
      },
    })
    return data
  } catch (err) {
    console.error('ERROR:::::::', err.message)
    return null
  }
}

export async function createUser(data) {
  try {
    return prisma.user.create({ data })
  } catch (err) {
    console.error(err.message)
    return null
  }
}

export async function findInBlacklist(ip = '') {
  try {
    return prisma.blackList.findUnique({ where: { ip } })
  } catch (err) {
    console.error(err.message)
    return null
  }
}

export async function createBlacklist(account: string, ip: string) {
  return prisma.blackList.create({
    data: {
      account,
      ip,
    },
  })
}
