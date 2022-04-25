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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordRequest = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
function discordRequest(endpoint, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://discord.com/api/v9/' + endpoint;
        if (options.body)
            options.body = JSON.stringify(options.body);
        const res = yield (0, node_fetch_1.default)(url, Object.assign({ headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json; charset=UTF-8',
            } }, options));
        if (!res.ok) {
            const data = yield res.json();
            console.log(res.status);
            throw new Error(JSON.stringify(data));
        }
        return res;
    });
}
exports.discordRequest = discordRequest;
//# sourceMappingURL=request.js.map