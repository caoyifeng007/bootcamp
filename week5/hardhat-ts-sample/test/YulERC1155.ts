import { expect } from "chai";
import { ethers, artifacts } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Contract, Signer, utils, BigNumber } from "ethers";

describe("YulERC1155Test", function() {
    const setup = async () => {
        const yulArtifact = await artifacts.readArtifact("YulERC1155");
        const iYulArtifact = await artifacts.readArtifact("IYulERC1155");

        const YulFactory = await ethers.getContractFactory(
            iYulArtifact.abi,
            yulArtifact.bytecode,
        );

        const accounts = await ethers.getSigners();
        const contract = await YulFactory.deploy();
        // console.log("setup running");
        // await contract.deployed();
        return { accounts, contract };
    };

    describe("hello test", async function() {
        let accounts: Signer[], contract: Contract;
        beforeEach(async function() {
            ({ accounts, contract } = await loadFixture(setup));
        });

        it("should return 0x123", async function() {
            const x = await contract.functions.noname();
            expect(x[0]).to.be.equal(BigNumber.from(0x123));
        });
    });
});
