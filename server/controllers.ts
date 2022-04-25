import { processCommand } from './discord/commands';
import { fetchFaucetBalances } from './faucet/balance';
import { Request, Response } from 'express'
import { formatError } from './faucet/errors';

export const faucetController = async (req: Request, res: Response) => {
  res.send('no implemented')
}

export const balanceController = async (req: Request, res: Response) => {
  try {
    const { network } = req.query
    const payload = await fetchFaucetBalances(network.toString())
    res.send(payload)
  } catch (err: any) {
    console.error(err)
    res
      .status(500)
      .json({ status: 'error', error: formatError(err), code: err.code })
  }
}

export const discordController = async (req, res) => {
  try {
    const payload = await processCommand(req.body)
    res.send(payload)
  } catch (err: any) {
    console.error(err)
  }
}
