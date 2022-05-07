import { InteractionResponseType, InteractionType } from 'discord-interactions'

export const processCommand = (body) => {
  const { type, data } = body
  console.log(JSON.stringify(body, null, 2))

  if (type === InteractionType.PING) {
    return { type: InteractionResponseType.PONG }
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data
    if (name === 'faucet') {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'test',
        },
      }
    }
  }
}
