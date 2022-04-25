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
exports.fetchFaucetBalances = void 0;
const ethers_1 = require("ethers");
const addresses_1 = require("./contracts/addresses");
const interfaces_1 = require("./interfaces");
const abi_1 = require("./contracts/abi");
const fetchFaucetBalances = (network) => __awaiter(void 0, void 0, void 0, function* () {
    if (!network) {
        throw new Error('missing params');
    }
    const fweb3FaucetAddress = (0, addresses_1.getContractAddress)(network.toString(), 'fweb3TokenFaucet');
    const provider = (0, interfaces_1.getProvider)(network.toString());
    const privk = (0, interfaces_1.getPrivk)(network.toString()) || '';
    const wallet = new ethers_1.ethers.Wallet(privk, provider);
    const fweb3TokenAddress = (0, addresses_1.getContractAddress)(network.toString(), 'fweb3Token');
    const maticFaucetAddress = (0, addresses_1.getContractAddress)(network.toString(), 'fweb3MaticFaucet');
    const fweb3FaucetAbi = (0, abi_1.loadAbi)('fweb3TokenFaucet');
    const fweb3TokenAbi = (0, abi_1.loadAbi)('fweb3Token');
    const maticFaucetAbi = (0, abi_1.loadAbi)('fweb3MaticFaucet');
    const fweb3Faucet = new ethers_1.ethers.Contract(fweb3FaucetAddress, fweb3FaucetAbi, wallet);
    const fweb3Token = new ethers_1.ethers.Contract(fweb3TokenAddress, fweb3TokenAbi, wallet);
    const maticFaucet = new ethers_1.ethers.Contract(maticFaucetAddress, maticFaucetAbi, wallet);
    const fweb3Drip = yield fweb3Faucet.dripAmount();
    const fweb3Balance = yield fweb3Token.balanceOf(fweb3FaucetAddress);
    const fweb3MaticBalance = yield provider.getBalance(fweb3FaucetAddress);
    const maticDrip = yield maticFaucet.dripAmount();
    const maticFaucetBalance = yield provider.getBalance(maticFaucetAddress);
    return {
        fweb3: {
            token_balance: fweb3Balance.toString(),
            matic_balance: fweb3MaticBalance.toString(),
            drip_amount: fweb3Drip.toString(),
        },
        matic: {
            matic_balance: maticFaucetBalance.toString(),
            drip_amount: maticDrip.toString(),
        },
    };
});
exports.fetchFaucetBalances = fetchFaucetBalances;
//# sourceMappingURL=balance.js.map