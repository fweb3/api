import { tokenMiddleware } from './middleware'
import { Request, Response } from 'express'
import {
  discordController,
  faucetController,
  balanceController,
} from './controllers'

export const routes = (app) => {
  app.get('/', (req: Request, res: Response) => {
    res.status(500).json('nope')
  })

  app.get('/heartbeat', (req: Request, res: Response) => {
    res.status(200).json('thump thump')
  })

  app.post('/discord/interactions', discordController)

  app.use('/api', tokenMiddleware)
  app.post('/api/faucet', faucetController)
  app.get('/api/balance', balanceController)
}
