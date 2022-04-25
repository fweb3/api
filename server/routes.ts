import { tokenMiddleware } from './middleware'
import {
  discordController,
  faucetController,
  balanceController,
} from './controllers'
import { Request, Response } from 'express'

export function routes(app) {
  app.get('/', (req: Request, res: Response) => {
    res.status(500).json('nope')
  })

  app.get('/heartbeat', (req: Request, res: Response) => {
    res.status(200).json('thump thump')
  })

  app.post('/discord/interactions', discordController)

  app.use('/api', tokenMiddleware)
  app.get('/api/faucet', faucetController)
  app.get('/api/balance', balanceController)
}
