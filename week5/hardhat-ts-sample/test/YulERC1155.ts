import { expect } from "chai";
import { ethers, artifacts } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Contract, Signer, utils, BigNumber } from "ethers";

describe("YulERC1155Test", function() {
    const setup = async () => {
        // readArtifact参数是.yul的文件名
        const yulArtifact = await artifacts.readArtifact("YulERC1155");
        // readArtifact参数是.sol中interface的名字
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

        it("should return https://game.example/api/item/{id}.json", async function() {
            const x = await contract.functions.uri(24);
            console.log(x[0]);
            expect(x[0]).to.be.equal("https://game.example/api/item/{id}.json");
        });
    });
});
