import { IPolygonResponse } from './polygonscan/poly.d'
import {
  fetchNormalTransactions,
  fetchERC20TransferEvents,
} from './polygonscan'

export const fetchGameStateForAccount = async (
  network: string,
  account: string
) => {
  // const data: IPolygonResponse = await fetchNormalTransactions(network, account)
  const data: IPolygonResponse = await fetchERC20TransferEvents(
    network,
    account,
    '0xeB33CB5d8233d892683fA1060cD211F6F0f498eb'
  )
  return data
}
