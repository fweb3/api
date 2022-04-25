import { discordRequest } from "./request";

const { DISCORD_APP_ID, DISCORD_GUILD_ID } = process.env;
const COMMANDS_ENDPOINT = `applications/${DISCORD_APP_ID}/guilds/${DISCORD_GUILD_ID}/commands`;

const TEST_COMMAND = {
  name: "test",
  description: "test command",
  type: 1,
};

const FAUCET_COMMAND = {
  name: "faucet",
  description: "fweb3 faucet",
  commandPrefix: "!",
  type: 1,
};

const BOT_COMMANDS = [TEST_COMMAND, FAUCET_COMMAND];

export const initializeBotCommands = async () => {
  if (!DISCORD_APP_ID || !DISCORD_GUILD_ID) return;
  BOT_COMMANDS.forEach((command) => checkAndInstallCommands(command));
};

async function checkAndInstallCommands(command) {
  try {
    const res = await discordRequest(COMMANDS_ENDPOINT, { method: "GET" });
    const data = await res.json();

    if (data) {
      const installedNames = data?.map((command) => command["name"]);

      if (!installedNames.includes(command["name"])) {
        console.log(`Installing "${command["name"]}"`);
        installGuildCommand(command);
      } else {
        console.log(`"${command["name"]}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

const installGuildCommand = async (command) => {
  try {
    await discordRequest(COMMANDS_ENDPOINT, { method: "POST", body: command });
  } catch (err) {
    console.error(err);
  }
};
