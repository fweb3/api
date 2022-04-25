"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCommand = void 0;
const discord_interactions_1 = require("discord-interactions");
const processCommand = ({ type, id, data }) => {
    if (type === discord_interactions_1.InteractionType.PING) {
        return { type: discord_interactions_1.InteractionResponseType.PONG };
    }
    if (type === discord_interactions_1.InteractionType.APPLICATION_COMMAND) {
        const { name } = data;
        if (name === 'test') {
            return {
                type: discord_interactions_1.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'test',
                },
            };
        }
        if (name === 'faucet') {
            return {
                type: discord_interactions_1.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'faucet',
                },
            };
        }
    }
};
exports.processCommand = processCommand;
//# sourceMappingURL=commands.js.map