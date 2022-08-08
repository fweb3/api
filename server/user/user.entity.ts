import { prisma } from '../../prisma'
import { Twitter, User, Prisma } from '@prisma/client'

export async function getUser(
  account: string
): Promise<User & { twitter: Twitter }> {
  try {
    const data = await prisma.user.findUnique({
      where: {
        account: account.toLowerCase(),
      },
      include: {
        twitter: true,
      },
    })
    return data
  } catch (err) {
    console.error(err.message)
    return null
  }
}

export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  try {
    return prisma.user.create({ data })
  } catch (err) {
    console.error(err.message)
    return null
  }
}

export async function updateUser(account: string, user: User) {
  try {
    return prisma.user.update({
      where: {
        account,
      },
      data: {
        ...user,
      },
    })
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function upsertUserTwitterRecord(account: string, data: Twitter) {
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
