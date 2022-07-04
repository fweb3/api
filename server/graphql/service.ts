import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class UserService {
  static async all() {
    return prisma.user.findMany()
  }

  static async create(account) {
    const user = await prisma.user.create({
      data: { account: account },
    })
    return user
  }

  static async find(account) {
    const user = await prisma.user.findUnique({
      where: {
        account,
      },
      include: {
        taskState: true,
      },
    })
    return user
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
