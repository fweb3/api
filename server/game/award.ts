import { calculateGameState } from './tasks'

export interface IAwardBody {
  network: string
  account: string
}

export const confirmAndAwardWinner = async ({
  network,
  account,
}: IAwardBody) => {
  const hasCompletedAllTasks = await _hasCompletedGame(network, account)
  console.log({ hasCompletedAllTasks })
}

const _hasCompletedGame = async (network: string, account: string) => {
  const currentPlayerState = await calculateGameState(network, account)
  console.log({ currentPlayerState })
}
