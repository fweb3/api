import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class UserService {
  static async all() {
    return prisma.user.findMany()
  }

  static async create(account) {
    return prisma.user.create({
      data: { account: account },
    })
  }

  static async find(account) {
    return prisma.user.findUnique({
      where: {
        account,
      },
    })
  }

  static async findOrCreate(account: string) {
    const user = await UserService.find(account)
    if (user) {
      return user
    }
    return UserService.create(account)
  }
}

export { UserService }
