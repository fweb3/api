"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivk = exports.getProvider = void 0;
const providers_1 = require("@ethersproject/providers");
const { LOCAL_PRIVK, MUMBAI_PRIVK, POLYGON_PRIVK, INFURA_PROJECT_ID, INFURA_PROJECT_SECRET, ALCHEMY_MAINNET_API_KEY, ALCHEMY_TESTNET_API_KEY, } = process.env;
const getProvider = (network) => {
    if (network === 'polygon' || network === 'original') {
        console.log(`[+] using mainnet provider`);
        return new providers_1.AlchemyProvider('matic', ALCHEMY_MAINNET_API_KEY);
    }
    else if (network === 'mumbai') {
        console.log(`[+] using mumbai alchemy provider`);
        return new providers_1.AlchemyProvider('maticmum', ALCHEMY_TESTNET_API_KEY);
    }
    else {
        console.log(`[+] using local provider rpc provider`);
        return new providers_1.JsonRpcProvider('http://localhost:8545');
    }
};
exports.getProvider = getProvider;
const getPrivk = (network) => {
    if (network === 'polygon') {
        console.log('[+] using polygon wallet');
        return POLYGON_PRIVK || '';
    }
    else if (network === 'mumbai') {
        console.log('[+] using mumbai wallet');
        return MUMBAI_PRIVK || '';
    }
    else {
        console.log('[+] using local wallet');
        return LOCAL_PRIVK || '';
    }
};
exports.getPrivk = getPrivk;
//# sourceMappingURL=interfaces.js.map