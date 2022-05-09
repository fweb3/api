import { Request, Response } from 'express'
import {
  discordController,
  faucetController,
  balanceController,
  discordGetCommands,
  discordDeleteCommands,
  discordPostCommands,
  faucetStateController,
} from './controllers'

export const routes = (app) => {
  app.get('/', (req: Request, res: Response) => {
    res.status(500).json('nope')
  })

  app.get('/heartbeat', (req: Request, res: Response) => {
    res.status(200).json('thump thump')
  })
  app.post('/bots/discord', discordController)
  app.get('/bots/discord/commands', discordGetCommands)
  app.post('/bots/discord/commands', discordPostCommands)
  app.delete('/bots/discord/commands', discordDeleteCommands)

  app.post('/api/faucet', faucetController)
  app.get('/api/faucet', faucetStateController)
  app.get('/api/balances', balanceController)
}
