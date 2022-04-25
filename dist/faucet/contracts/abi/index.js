"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAbi = void 0;
const fweb3TokenFaucet_json_1 = __importDefault(require("./fweb3TokenFaucet.json"));
const fweb3MaticFaucet_json_1 = __importDefault(require("./fweb3MaticFaucet.json"));
const fweb3Token_json_1 = __importDefault(require("./fweb3Token.json"));
const INTERFACE_MAP = {
    fweb3TokenFaucet: fweb3TokenFaucet_json_1.default,
    fweb3MaticFaucet: fweb3MaticFaucet_json_1.default,
    fweb3Token: fweb3Token_json_1.default,
};
const loadAbi = (name) => {
    return INTERFACE_MAP[name].abi;
};
exports.loadAbi = loadAbi;
//# sourceMappingURL=index.js.map