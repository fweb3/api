import { User } from '@prisma/client'
import { GameTaskState } from './game/game.d'

declare module '*.json' {
  const value: unknown
  export default value
}

export interface IClientPayload extends User {
  status: string
  message?: string
  created?: boolean
  taskState?: GameTaskState
  ruleViolations?: string[]
}
