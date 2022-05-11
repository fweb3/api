import { calculateGameState } from './tasks'
import { STATE_TASKS } from './states'
export interface IAwardBody {
  network: string
  account: string
}

export const confirmAndAwardWinner = async ({
  network,
  account,
}: IAwardBody) => {
  const hasCompletedAllTasks = await _hasCompletedGame(network, account)
  if (!hasCompletedAllTasks) {
    return {
      status: 'error',
      type: 'GAME_NOT_FINISHED',
      message: 'Has not finished game',
    }
  }
  return {
    status: 'success',
    token_id: 'here is the id',
    opensea_link: 'should send link?',
  }
}

const _hasCompletedGame = async (network: string, account: string) => {
  const currentPlayerState = await calculateGameState(network, account)
  return (
    STATE_TASKS.filter((task) => currentPlayerState[task] === true).length ===
    STATE_TASKS.length
  )
}
