import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { ExampleClone, ExampleCloneFactory } from "../../typechain-types";

import { Signer, utils, BigNumber } from "ethers";

const { formatBytes32String, getAddress } = utils;

const ADDRESS = getAddress("0x6b175474e89094c44da98b954eedeac495271d0f");

describe("ClonesWithImmutableArgs use case Test", function() {
    const setup = async () => {
        const accounts = await ethers.getSigners();

        console.log(ADDRESS);

        const ExampleCloneFactory = await ethers.getContractFactory(
            "ExampleClone",
        );
        const ExampleCloneFactoryFactory = await ethers.getContractFactory(
            "ExampleCloneFactory",
        );

        const masterContract = await ExampleCloneFactory.deploy();
        const cloneFactory = await ExampleCloneFactoryFactory.deploy(
            masterContract.address,
        );

        return { accounts, cloneFactory };
    };

    describe("hello test", async function() {
        let accounts: Signer[], cloneFactory: ExampleCloneFactory;
        beforeEach(async function() {
            ({ accounts, cloneFactory } = await loadFixture(setup));
        });

        it("should ", async function() {
            // 如何获得tx的返回值,可以参考
            // https://stackoverflow.com/q/72356857/12606766
            const cloneTx = await cloneFactory.createClone(ADDRESS, 1, 2, 3);
            const cloneReceipt = await cloneTx.wait();
            const cloneEvent = cloneReceipt.events![0];
            const { addr } = cloneEvent.args!;

            const clone1 = new ethers.Contract(
                addr,
                [
                    "function param1() public pure returns (address)",
                    "function param2() public pure returns (uint256)",
                    "function param3() public pure returns (uint64)",
                    "function param4() public pure returns (uint8)",
                ],
                accounts[1],
            ) as ExampleClone;

            const arg1 = await clone1.param1();
            const arg2 = await clone1.param2();
            const arg3 = await clone1.param3();
            const arg4 = await clone1.param4();

            expect(arg1).to.be.equal(ADDRESS);
            expect(arg2).to.be.equal(BigNumber.from("1"));
            expect(arg3).to.be.equal(BigNumber.from("2"));
            expect(arg4).to.be.equal(3);
        });
    });
});
