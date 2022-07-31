// import { initializeBotCommands } from './discord/initialize'
import { middleware } from './middleware'
import { routes } from './routes'
import express from 'express'
import { createApolloServer } from './graphql'

const { PORT = 3001 } = process.env

;(async () => {
  try {
    const app = express()

    middleware(app)
    routes(app)
    // await createApolloServer(app)

    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is listening on [${PORT}]`)
      console.log(`🔥 version: [v1.1]`)
      // initializeBotCommands()
    })
  } catch (err) {
    console.error(err.message)
  }
})()
