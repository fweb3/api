import { discordRequest } from './request'

const { APP_ID, GUILD_ID } = process.env

const COMMANDS_ENDPOINT = `applications/${APP_ID}/guilds/${GUILD_ID}/commands`

const FAUCET_COMMAND = {
  name: 'faucet',
  description: 'foo bar',
  type: 1,
}

const BOT_COMMANDS = [FAUCET_COMMAND]

export const initializeBotCommands = async () => {
  if (!APP_ID || !GUILD_ID) return
  BOT_COMMANDS.forEach((command) => checkAndInstallCommands(command))
}

async function checkAndInstallCommands(command) {
  try {
    const res = await discordRequest(COMMANDS_ENDPOINT, { method: 'GET' })
    const data = await res.json()
    // console.log({ data })
    // await removeAllCommands(data)
    await installGuildCommand(command)
    if (data) {
      const installedNames = data?.map((command) => command['name'])
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`)
        await installGuildCommand(command)
        console.log(`Installed "${command['name']}"`)
      } else {
        console.log(`"${command['name']}" command already installed`)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

// const removeAllCommands = async (data) => {
//   data?.map(async ({ id }) => {
//     await discordRequest(`${COMMANDS_ENDPOINT}/${id}`, { method: 'DELETE' })
//   })
// }

const installGuildCommand = async (command) => {
  try {
    await discordRequest(COMMANDS_ENDPOINT, { method: 'POST', body: command })
  } catch (err) {
    console.error(err)
  }
}
