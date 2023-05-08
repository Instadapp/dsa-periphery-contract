import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
import { HttpNetworkUserConfig } from "hardhat/types";

dotenv.config();

const { ALCHEMY_API_KEY, PRIVATE_KEY, ADMIN_PRIVATE_KEY } = process.env;

if (!ALCHEMY_API_KEY) {
  throw new Error("Please set your ALCHEMY_API_KEY in a .env file");
}

const sharedNetworkConfig: HttpNetworkUserConfig = {};

// public address 0xEFfBa20f2E744DfCfdD2Cf122b93999f9a84Ef08
// randomly generated for test purposes, do not use for actual deployment!
const DEFAULT_PRIVATE_KEY =
  "6666459e446e2b0d620443b02f1f6be4f10df8e2fea81c9f8b343fb5bbfb7743";

sharedNetworkConfig.accounts = [PRIVATE_KEY || DEFAULT_PRIVATE_KEY, ADMIN_PRIVATE_KEY || PRIVATE_KEY || DEFAULT_PRIVATE_KEY];

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
        blockNumber: 16613408,
      },
      gasPrice: 151101000000,
    },
    mainnet: {
      ...sharedNetworkConfig,
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      gasPrice: 30000000000,
    },
    // polygon: {
    // ...sharedNetworkConfig,
    //   url: `https://polygon-mainnet.g.alchemy.com/v2/_0XLzPG1pRbslUtMjh592yby_0tkx6w6`,
    //   gasPrice: 260000000000,
    // },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      mainnet: String(process.env.ETHERSCAN_API_KEY),
      polygon: String(process.env.POLYGONSCAN_API_KEY),
    },
  },
  mocha: {
    timeout: 10000 * 10000,
  },
};

export default config;
