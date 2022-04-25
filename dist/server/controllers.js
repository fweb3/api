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
exports.discordController = exports.balanceController = exports.faucetController = void 0;
const commands_1 = require("./discord/commands");
const balance_1 = require("./faucet/balance");
const errors_1 = require("./faucet/errors");
const faucetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('no implemented');
});
exports.faucetController = faucetController;
const balanceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { network } = req.query;
        const payload = yield (0, balance_1.fetchFaucetBalances)(network.toString());
        res.send(payload);
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ status: 'error', error: (0, errors_1.formatError)(err), code: err.code });
    }
});
exports.balanceController = balanceController;
const discordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield (0, commands_1.processCommand)(req.body);
        res.send(payload);
    }
    catch (err) {
        console.error(err);
    }
});
exports.discordController = discordController;
//# sourceMappingURL=controllers.js.map