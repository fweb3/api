import { IUserTwitterData } from '../user/user.d'
import { prisma } from '../../prisma'
import { IUser } from './user.d'

export async function getUser(account: string): Promise<IUser> {
  try {
    const data = await prisma.user.findUnique({
      where: {
        account: account.toLowerCase(),
      },
      include: {
        ipinfo: true,
        twitter: true,
      },
    })
    return data
  } catch (err) {
    console.error(err.message)
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

export async function upsertUserTwitterRecord(
  account: string,
  data: IUserTwitterData
) {
  return prisma.user.update({
    where: { account },
    data: {
      twitter: {
        upsert: {
          create: {
            ...data,
          },
          update: {
            ...data,
          },
        },
      },
    },
    include: {
      twitter: true,
    },
  })
}
