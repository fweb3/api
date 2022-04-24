import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const { PORT } = process.env

const app: Express = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
