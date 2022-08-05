import { prisma } from '../../prisma'
import { IUser } from './user.d'

export async function getUser(account: string): Promise<IUser> {
  try {
    const data = await prisma.user.findUnique({
      where: {
        account,
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
