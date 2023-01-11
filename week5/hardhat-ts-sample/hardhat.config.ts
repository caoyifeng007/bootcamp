import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { task } from "hardhat/config";

import "@nomiclabs/hardhat-solhint";
import "@openzeppelin/hardhat-upgrades";

// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// 最开始文档上是这个写法,现在不知道为什么改了,可以看这个issue: https://github.com/motdotla/dotenv/issues/704
import "dotenv/config";

import "@tovarishfin/hardhat-yul";

// set proxy
// 为了解决 hh verify 时的bug
import { ProxyAgent, setGlobalDispatcher } from "undici";
const proxyAgent = new ProxyAgent("http://127.0.0.1:1080"); // change to yours
setGlobalDispatcher(proxyAgent);

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

    defaultNetwork: "gorli",
    // defaultNetwork: "hardhat",
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
        gorli: {
            url: `${process.env.INFURA_KEY}`,
            accounts: [
                `${process.env.ACCOUNT_4_PK}`,
                `${process.env.ACCOUNT_3_PK}`,
            ],
        },
    },

    // https://etherscan.io/myapikey
    // 如果你的程序想调用Etherscan的某些功能或服务,就需要API Key来链接
    // 登录Etherscan后可以获得API Key
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
    },
);
export default config;
