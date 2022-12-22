import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, artifacts } from "hardhat";
import { JsonRpcProvider, BaseProvider } from "@ethersproject/providers";

import { Contract } from "ethers";
const { utils, BigNumber } = ethers;

import { Artifact } from "hardhat/types";

describe("YulERC1155Test", function() {
    let contract: Contract;
    let accounts: SignerWithAddress[];

    let yulArtifact: Artifact;
    let iYulArtifact: Artifact;

    beforeEach(async function() {
        yulArtifact = await artifacts.readArtifact("YulERC1155");
        iYulArtifact = await artifacts.readArtifact("IYulERC1155");

        const YulFactory = await ethers.getContractFactory(
            iYulArtifact.abi,
            yulArtifact.bytecode,
        );

        accounts = await ethers.getSigners();
        contract = await YulFactory.deploy();
        await contract.deployTransaction.wait();
    });

    describe("hello test", async function() {
        it("should return 0x123", async function() {
            const x = await contract.functions.noname();
            // console.log(x);
            expect(x[0]).to.be.equal(BigNumber.from(0x123));
        });
    });
});
