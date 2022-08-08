import { BlacklistReason, User, Blacklist } from '@prisma/client'
import { prisma } from '../../prisma'

export async function createBlacklist(
  userRecord: User,
  reason: BlacklistReason
): Promise<Blacklist> {
  try {
    return prisma.blacklist.create({
      data: {
        ip: userRecord.ip,
        account: userRecord.account,
        reason,
      },
    })
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function findBlacklistByIp(ip: string): Promise<Blacklist> {
  try {
    return prisma.blacklist.findUnique({ where: { ip } })
  } catch (err) {
    console.error(err)
  }
}
