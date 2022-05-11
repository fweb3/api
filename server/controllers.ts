import { formatGameErrors } from './errors/gameErrors'
import { formatFaucetErrors } from './errors/faucetErrors'
import { calculateGameState, confirmAndAwardWinner } from './game'
import { log } from './logger'
import { processCommand } from './discord/commands'
import { Request, Response } from 'express'
import { ContractReceipt } from 'ethers'
import {
  requestDripFromFaucet,
  fetchBalances,
  fetchCurrentFaucetState,
} from './faucet'

export const gameController = async (req: Request, res: Response) => {
  try {
    const { network, account } = req.query
    const payload = await calculateGameState(
      network.toString(),
      account.toString()
    )
    res.status(200).json(payload)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const faucetController = async (req: Request, res: Response) => {
  try {
    const receipt: ContractReceipt = await requestDripFromFaucet(req.body)
    res.status(200).json({
      status: 'success',
      message: 'ok',
      transaction_hash: receipt?.transactionHash,
      raw_receipt: receipt,
    })
  } catch (err) {
    log.debug({ err })
    const formattedError = formatFaucetErrors(err)
    res.status(500).json(formattedError)
  }
}

export const balanceController = async (req: Request, res: Response) => {
  try {
    const { network, address } = req.query
    const payload = await fetchBalances(
      network?.toString(),
      address?.toString() || ''
    )
    return res.status(200).json(payload)
  } catch (err) {
    log.error(JSON.stringify(err))
    const errorPayload = {
      status: 'error',
      message: err.message,
    }
    res.status(500).json(errorPayload)
  }
}

export const faucetStateController = async (req: Request, res: Response) => {
  try {
    const { network } = req.query
    const payload = await fetchCurrentFaucetState(network?.toString())
    return res.status(200).json(payload)
  } catch (err) {
    const errorPayload = {
      status: 'error',
      message: err.message,
    }
    res.status(500).json(errorPayload)
  }
}

export const awardController = async (req: Request, res: Response) => {
  try {
    const payload = await confirmAndAwardWinner(req.body)
    return res.status(200).json(payload)
  } catch (err) {
    const errorPayload = formatGameErrors(err)
    res.status(500).json(errorPayload)
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
