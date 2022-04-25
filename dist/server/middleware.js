"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.tokenMiddleware = exports.verifyDiscordRequest = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const discord_interactions_1 = require("discord-interactions");
const { API_KEYS } = process.env;
function verifyDiscordRequest(clientKey) {
    return function (req, res, buf, encoding) {
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');
        const isValidRequest = (0, discord_interactions_1.verifyKey)(buf, signature, timestamp, clientKey);
        if (!isValidRequest) {
            res.status(401).send('Bad request signature');
            throw new Error('Bad request signature');
        }
    };
}
exports.verifyDiscordRequest = verifyDiscordRequest;
const tokenMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    const keysArr = API_KEYS.split(',');
    const token = authorization === null || authorization === void 0 ? void 0 : authorization.split('Bearer ')[1];
    if (!(keysArr === null || keysArr === void 0 ? void 0 : keysArr.includes(token))) {
        console.log('unauthorized');
        res.status(401).json('unauthorized');
        return;
    }
    next();
};
exports.tokenMiddleware = tokenMiddleware;
const middleware = (app) => {
    app.use('/discord', express_1.default.json({ verify: verifyDiscordRequest(process.env.DISCORD_PUBLIC_KEY) }));
    app.use(body_parser_1.default.json());
    app.use((0, morgan_1.default)('tiny'));
    app.use((0, helmet_1.default)());
    app.use('/faucet', exports.tokenMiddleware);
};
exports.middleware = middleware;
//# sourceMappingURL=middleware.js.map