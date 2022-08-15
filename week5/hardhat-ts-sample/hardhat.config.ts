import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { task } from "hardhat/config";

import "@nomiclabs/hardhat-solhint";

import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    //   defaultNetwork: "rinkeby",
    networks: {
        hardhat: {
            forking: {
                // url: `${process.env.alchemyKey}`,
                url: `${process.env.infuraKey}`,
                blockNumber: 11200000,
            },
        },
        // rinkeby: {
        //     url:`${process.env.infuraKey}`,
        //     accounts: ["de982a3f252280315f34f5233b2be61b89e7e6e6801c4b04a4bfa0c1c7d31fda","0afa5ec8e9f6b17506328e789216c3332a91ecd6b682dbf66fc5cf728e918b31"]
        //   }
    },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});
export default config;
