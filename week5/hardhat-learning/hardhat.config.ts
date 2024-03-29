import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "tsconfig-paths/register";

import { task } from "hardhat/config";

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    // networks: {
    //     hardhat: {
    //         forking: {
    //             url: "https://eth-mainnet.alchemyapi.io/v2/<key>",
    //             blockNumber: 14390000,
    //         },
    //     },
    // },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

export default config;
