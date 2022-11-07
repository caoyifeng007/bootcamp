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
        const [owner, attackerWallet] = await ethers.getSigners();
        const value = ethers.utils.parseEther("1");

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy({ value });

        return { victimContract, attackerWallet, owner };
    }

    describe("exploit", async function () {
        let victimContract, attackerWallet;
        before(async function () {
            ({ victimContract, attackerWallet, owner } = await loadFixture(
                setup,
            ));
        });

        it("conduct your attack here", async function () {
            const AttackerFactory = await ethers.getContractFactory(
                "DemocracyAttacker",
            );
            const attackerContract = await AttackerFactory.connect(
                attackerWallet,
            ).deploy(victimContract.address);
            await attackerContract.deployTransaction.wait();

            const mintTx = await victimContract
                .connect(owner)
                .mint(attackerContract.address, 10, {
                    value: ethers.utils.parseEther("1000"),
                });
            await mintTx.wait();

            await attackerContract.attack();
        });

        after(async function () {
            const victimContractBalance = await ethers.provider.getBalance(
                victimContract.address,
            );
            expect(victimContractBalance).to.be.equal("0");
        });
    });
});
