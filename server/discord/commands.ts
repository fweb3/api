import { InteractionResponseType, InteractionType } from "discord-interactions"

export const processCommand = ({ type, id, data }) => {
  if (type === InteractionType.PING) {
    return { type: InteractionResponseType.PONG }
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data
    if (name === 'test') {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'test',
        },
      }
    }

    if (name === 'faucet') {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'faucet',
        },
      }
    }
  }
}
