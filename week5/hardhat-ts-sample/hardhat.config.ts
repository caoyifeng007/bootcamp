import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { task } from "hardhat/config";

import "@nomiclabs/hardhat-solhint";

import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import "@tovarishfin/hardhat-yul";

// set proxy
// 为了解决 hh verify 时的bug
// import { ProxyAgent, setGlobalDispatcher } from "undici";
// const proxyAgent = new ProxyAgent("http://127.0.0.1:1080"); // change to yours
// setGlobalDispatcher(proxyAgent);

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.6.12",
        settings: {},
      },
    ],
  },

  // defaultNetwork: "rinkeby",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `${process.env.ALCHEMY_KEY}`,
        // url: `${process.env.INFURA_KEY}`,
        blockNumber: 15352600,
      },
      // https://hardhat.org/hardhat-network/docs/overview#logging
      // This logging is enabled by default when using Hardhat Network's node (i.e. npx hardhat node)
      // But disabled when using the in-process Hardhat Network provider.
      // 所以当tx失败，需要查看一下交易详情的时候可以设置为true
      // loggingEnabled: true,
    },
    rinkeby: {
      url: `${process.env.INFURA_KEY}`,
      accounts: [`${process.env.ACCOUNT_4_PK}`, `${process.env.ACCOUNT_3_PK}`],
    },
  },

  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-ethers#usage
task(
  "blockNumber",
  "Prints the current block number",
  async (_, { ethers }) => {
    await ethers.provider.getBlockNumber().then((blockNumber) => {
      console.log("Current block number: " + blockNumber);
    });
  }
);
export default config;
