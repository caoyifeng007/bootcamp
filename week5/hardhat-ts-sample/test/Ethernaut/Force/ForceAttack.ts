import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
const { BigNumber } = ethers;
const { parseEther, hexStripZeros } = ethers.utils;
import { Force, ForceAttacker } from "../../../typechain-types";

describe("Telephone", function() {
    let ForceContract: Force;
    let ForceAttackerContract: ForceAttacker;
    let accounts: SignerWithAddress[];

    const DEPLOYER_ID = 3;
    const ATTACKER_ID = 5;

    beforeEach(async function() {
        const ForceFactory = await ethers.getContractFactory("Force");
        const ForceAttackerFactory = await ethers.getContractFactory(
            "ForceAttacker",
        );

        accounts = await ethers.getSigners();
        ForceContract = await ForceFactory.deploy();
        await ForceContract.deployTransaction.wait();

        ForceAttackerContract = await ForceAttackerFactory.deploy();
        await ForceAttackerContract.deployTransaction.wait();

        await ethers.provider.send("hardhat_setBalance", [
            ForceAttackerContract.address,
            hexStripZeros(parseEther("1").toHexString()),
        ]);
    });

    describe("Force", async function() {
        it("should be 0 ether before attack", async function() {
            expect(await ForceContract.getBalance()).to.be.equal(0);
        });

        it("should be 1 ether after attack", async function() {
            accounts[ATTACKER_ID].sendTransaction;
            const selfdestructTx = await ForceAttackerContract.attack(
                ForceContract.address,
            );
            await selfdestructTx.wait();

            expect(await ForceContract.getBalance()).to.be.equal(
                parseEther("1").toHexString(),
            );
        });
    });
});
