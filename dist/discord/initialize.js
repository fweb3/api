"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeBotCommands = void 0;
const request_1 = require("./request");
const { DISCORD_APP_ID, DISCORD_GUILD_ID } = process.env;
const COMMANDS_ENDPOINT = `applications/${DISCORD_APP_ID}/guilds/${DISCORD_GUILD_ID}/commands`;
const TEST_COMMAND = {
    name: 'test',
    description: 'test command',
    type: 1,
};
const FAUCET_COMMAND = {
    name: 'faucet',
    description: 'fweb3 faucet',
    commandPrefix: '!',
    type: 1,
};
const BOT_COMMANDS = [TEST_COMMAND, FAUCET_COMMAND];
const initializeBotCommands = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!DISCORD_APP_ID || !DISCORD_GUILD_ID)
        return;
    BOT_COMMANDS.forEach((command) => checkAndInstallCommands(command));
});
exports.initializeBotCommands = initializeBotCommands;
function checkAndInstallCommands(command) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield (0, request_1.discordRequest)(COMMANDS_ENDPOINT, { method: 'GET' });
            const data = yield res.json();
            if (data) {
                const installedNames = data === null || data === void 0 ? void 0 : data.map((command) => command['name']);
                if (!installedNames.includes(command['name'])) {
                    console.log(`Installing "${command['name']}"`);
                    installGuildCommand(command);
                }
                else {
                    console.log(`"${command['name']}" command already installed`);
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    });
}
const installGuildCommand = (command) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, request_1.discordRequest)(COMMANDS_ENDPOINT, { method: 'POST', body: command });
    }
    catch (err) {
        console.error(err);
    }
});
//# sourceMappingURL=initialize.js.map