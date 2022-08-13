import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Greeter } from "../typechain-types";

describe("Greeter", function () {
    let contract: Greeter;
    beforeEach(async function () {
        const ContractFactory = await ethers.getContractFactory("Greeter");
        contract = await ContractFactory.deploy("Hello, world!");
        console.log(contract);
        await contract.deployTransaction.wait();
    });

    it.only("Should return the new greeting once it's changed", async function () {
        expect(await contract.greet()).to.equal("Hello, world!");

        const setGreetingTx = await contract.setGreeting("你好");
        console.log(setGreetingTx);

        // wait until the transaction is mined
        await setGreetingTx.wait();

        expect(await contract.greet()).to.equal("你好");
    });
});
