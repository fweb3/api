import { createBlacklist } from './blacklist.entity'
import { User, BlacklistReason, Blacklist } from '@prisma/client'

export async function createBlacklistRecord(
  userRecord: User,
  reason = BlacklistReason.BLACKLIST_UNKNOWN
): Promise<Blacklist> {
  try {
    return createBlacklist(userRecord, reason)
  } catch (err) {
    console.error(err)
    return null
  }
}
