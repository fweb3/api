import express, { Express, NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { verifyKey } from 'discord-interactions'
import cors from 'cors'

const { API_TOKENS, ALLOWED_HOSTS } = process.env

export function verifyDiscordRequest(clientKey) {
  return function (req, res, buf) {
    const signature = req.get('X-Signature-Ed25519')
    const timestamp = req.get('X-Signature-Timestamp')

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey)
    if (!isValidRequest) {
      res.status(401).send('Bad request signature')
      throw new Error('Bad request signature')
    }
  }
}

export const tokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers
  const keysArr = API_TOKENS.split(',')
  const token = authorization?.split('Bearer ')[1]

  if (!keysArr?.includes(token)) {
    console.log('unauthorized')
    res.status(401).json('unauthorized')
    return
  }

  next()
}
const corsConfig = {
  origin: ALLOWED_HOSTS.split(','),
  methods: ['GET', 'POST', 'OPTIONS'],
}

export const middleware = (app: Express) => {
  app.use(
    '/discord',
    express.json({
      verify: verifyDiscordRequest(process.env.DISCORD_PUBLIC_KEY),
    })
  )
  app.use(bodyParser.json())
  app.use(morgan('tiny'))
  app.use(helmet())
  app.use(cors(corsConfig))
  app.use('/faucet', tokenMiddleware)
}
