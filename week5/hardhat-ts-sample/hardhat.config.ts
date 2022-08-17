import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { task } from "hardhat/config";

import "@nomiclabs/hardhat-solhint";

import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

// set proxy
// 为了解决 hh verify 时的bug
import { ProxyAgent, setGlobalDispatcher } from "undici";
const proxyAgent = new ProxyAgent("http://127.0.0.1:1080"); // change to yours
setGlobalDispatcher(proxyAgent);

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {
      forking: {
        url: `${process.env.ALCHEMY_KEY}`,
        // url: `${process.env.INFURA_KEY}`,
        blockNumber: 15352600,
      },
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
