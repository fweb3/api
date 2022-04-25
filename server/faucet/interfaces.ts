import { AlchemyProvider, JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
const {
  LOCAL_PRIVK,
  MUMBAI_PRIVK,
  POLYGON_PRIVK,
  INFURA_PROJECT_ID,
  INFURA_PROJECT_SECRET,
  ALCHEMY_MAINNET_API_KEY,
  ALCHEMY_TESTNET_API_KEY,
} = process.env;

type Provider =
  | ethers.providers.JsonRpcProvider
  | ethers.providers.InfuraProvider
  | ethers.providers.BaseProvider
  | ethers.providers.AlchemyProvider;

export const getProvider = (network: string): Provider => {
  if (network === "polygon" || network === "original") {
    console.log(`[+] using mainnet provider`);
    return new AlchemyProvider("matic", ALCHEMY_MAINNET_API_KEY);
  } else if (network === "mumbai") {
    console.log(`[+] using mumbai alchemy provider`);
    return new AlchemyProvider("maticmum", ALCHEMY_TESTNET_API_KEY);
  } else {
    console.log(`[+] using local provider rpc provider`);
    return new JsonRpcProvider("http://localhost:8545");
  }
};

export const getPrivk = (network: string): string => {
  if (network === "polygon") {
    console.log("[+] using polygon wallet");
    return POLYGON_PRIVK || "";
  } else if (network === "mumbai") {
    console.log("[+] using mumbai wallet");
    return MUMBAI_PRIVK || "";
  } else {
    console.log("[+] using local wallet");
    return LOCAL_PRIVK || "";
  }
};
