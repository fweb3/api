import { processCommand } from './discord/commands'
import { Request, Response } from 'express'
import {
  fetchFaucetBalances,
  requestDripFromFaucet,
  formatError,
} from './faucet'

export const faucetController = async (req: Request, res: Response) => {
  try {
    const receipt = await requestDripFromFaucet(req.body)
    res.status(200).json(receipt)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: formatError(err),
      status: 'error',
      code: err?.code || 'NO_CODE',
    })
  }
}

export const balanceController = async (req: Request, res: Response) => {
  try {
    const { network } = req.query
    const payload = await fetchFaucetBalances(network.toString())
    res.status(200).json(payload)
  } catch (err: unknown) {
    console.error(err)
    res.status(500).json({ status: 'error', error: formatError(err as Error) })
  }
}

export const discordController = async (req, res) => {
  try {
    const payload = await processCommand(req.body)
    res.send(payload)
  } catch (err: unknown) {
    console.error(err)
  }
}
