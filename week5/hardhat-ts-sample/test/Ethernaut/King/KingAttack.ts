import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
const { BigNumber } = ethers;
const { parseEther, hexStripZeros } = ethers.utils;
const { getBalance } = ethers.provider;
import { King, KingAttacker } from "../../../typechain-types";

describe("King", function() {
    let KingContract: King;
    let KingAttackContract: KingAttacker;
    let accounts: SignerWithAddress[];

    const DEPLOYER_ID = 3;
    const ATTACKER_ID = 5;
    const ANOTHERONE_ID = 4;

    beforeEach(async function() {
        const KingFactory = await ethers.getContractFactory("King");
        const KingAttackerFactory = await ethers.getContractFactory(
            "KingAttacker",
        );

        accounts = await ethers.getSigners();
        KingContract = await KingFactory.connect(accounts[DEPLOYER_ID]).deploy({
            value: parseEther("10"),
        });
        await KingContract.deployTransaction.wait();

        KingAttackContract = await KingAttackerFactory.connect(
            accounts[ATTACKER_ID],
        ).deploy(KingContract.address);
        await KingAttackContract.deployTransaction.wait();
    });

    describe("King", async function() {
        it("owenr should be DEPLOYER_ID", async function() {
            expect(await KingContract.owner()).to.be.equals(
                accounts[DEPLOYER_ID].address,
            );
        });

        it("prize should be 10 ethers", async function() {
            expect(await getBalance(KingContract.address)).to.be.equals(
                parseEther("10").toHexString(),
            );
        });

        it("king should be DEPLOYER_ID", async function() {
            expect(await KingContract._king()).to.be.equals(
                accounts[DEPLOYER_ID].address,
            );
        });
    });

    describe("KingAttacker", async function() {
        it("Victim address should be right", async function() {
            expect(await KingAttackContract.king()).to.be.equals(
                KingContract.address,
            );
        });

        it("ATTACKER_ID claim to be King with 35 ether", async function() {
            // https://docs.ethers.io/v5/api/contract/contract/#Contract-functionsCall
            // ethersjs关于这个语法的描述
            const attTx = await KingAttackContract.attack({
                value: parseEther("35"),
            });
            await attTx.wait();

            expect(await KingContract._king()).to.be.equals(
                KingAttackContract.address,
            );
        });

        // TODO
        // 如何用一个账号直接调用合约的callback
        it("No one can claim King after attack", async function() {
            await expect(
                await KingContract.connect(accounts[ANOTHERONE_ID]).fallback({
                    value: parseEther("50"),
                }),
            ).to.be.revertedWith("You can't claim to be King!");
        });
    });
});
