import { IUser, IGameTaskState } from './user/user.d'

declare module '*.json' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any
  export default value
}

export interface IClientPayload extends IUser {
  status: string
  message?: string
  created?: boolean
  taskState?: IGameTaskState
  ruleViolations?: string[]
}
