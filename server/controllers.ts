import { processCommand } from './discord/commands'
import { Request, Response } from 'express'
import { fetchFaucetBalances, requestDripFromFaucet } from './faucet'
import type { IErrors } from './faucet/errors'

export const faucetController = async (req: Request, res: Response) => {
  try {
    const receipt = await requestDripFromFaucet(req.body)
    res.status(200).json(receipt)
  } catch (formattedError: IErrors | unknown) {
    res.status(500).json(formattedError)
  }
}

export const balanceController = async (req: Request, res: Response) => {
  try {
    const { network } = req.query
    const payload = await fetchFaucetBalances(network.toString())
    res.status(200).json(payload)
  } catch (formattedError: IErrors | unknown) {
    res.status(500).json(formattedError)
  }
}

export const discordController = async (req, res) => {
  try {
    console.log({ req })
    const payload = await processCommand(req.body)
    res.send(payload)
  } catch (err: unknown) {
    console.error(err)
  }
}

export const discordGetCommands = async (req, res) => {
  res.send('ok')
}
export const discordPostCommands = async (req, res) => {
  res.send('ok')
}
export const discordDeleteCommands = async (req, res) => {
  res.send('ok')
}
