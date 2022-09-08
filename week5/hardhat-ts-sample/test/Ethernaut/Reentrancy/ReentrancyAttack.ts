import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
const { getBalance } = ethers.provider;
const { parseEther } = ethers.utils;
import { Reentrance, ReentrancyAttacker } from "../../../typechain-types";

describe("Telephone", function() {
    let ReContract: Reentrance;
    let ReAttackerContract: ReentrancyAttacker;
    let accounts: SignerWithAddress[];

    const DEPLOYER_ID = 3;
    const ATTACKER_ID = 5;

    beforeEach(async function() {
        const ReFactory = await ethers.getContractFactory("Reentrance");
        const ReAttackerFactory = await ethers.getContractFactory(
            "ReentrancyAttacker",
        );

        accounts = await ethers.getSigners();
        ReContract = await ReFactory.connect(accounts[DEPLOYER_ID]).deploy();
        await ReContract.deployTransaction.wait();

        await ethers.provider.send("hardhat_setBalance", [
            ReContract.address,
            parseEther("10").toHexString(),
        ]);

        ReAttackerContract = await ReAttackerFactory.connect(
            accounts[ATTACKER_ID],
        ).deploy(ReContract.address);
        await ReAttackerContract.deployTransaction.wait();
    });

    describe("Reentrance", async function() {
        it("Victim address should be right", async function() {
            expect(await ReAttackerContract.reentrance()).to.be.equals(
                ReContract.address,
            );
        });

        it("shoud be 10 ether before attack", async function() {
            expect(await getBalance(ReContract.address)).to.be.equal(
                parseEther("10").toHexString(),
            );
        });

        it("shoud be 0 ether after attack", async function() {
            const attTx = await ReAttackerContract.attack({
                value: parseEther("1"),
            });
            await attTx.wait();

            expect(await getBalance(ReContract.address)).to.be.equal(
                parseEther("0").toHexString(),
            );
        });

        // it("after attack owner has changed", async function() {
        //     const attackTx = await TelAttackerContract.connect(
        //         accounts[ATTACKER_ID],
        //     ).attack();
        //     await attackTx.wait();

        //     expect(await TelContract.owner()).to.be.equal(
        //         TelAttackerContract.address,
        //     );
        // });
    });
});
