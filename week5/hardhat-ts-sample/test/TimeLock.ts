import { expect } from "chai";
import { ethers } from "hardhat";
import { TimeLock } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { JsonRpcProvider, BaseProvider } from "@ethersproject/providers";

const { utils, BigNumber } = ethers;

describe("TimeLock", function () {
    let contract: TimeLock;
    let accounts: SignerWithAddress[];
    let provider: JsonRpcProvider;
    const SMALL_ETHER = BigNumber.from(utils.parseEther("0.01"));

    beforeEach(async function () {
        const factory = await ethers.getContractFactory("TimeLock");
        contract = await factory.deploy();
        await contract.deployTransaction.wait();

        accounts = await ethers.getSigners();
        provider = await ethers.provider;
    });

    context("initial conditions", async function () {
        it("should have zero balance", async function () {
            const balance = await provider.getBalance(contract.address);
            expect(balance).to.be.equal(BigNumber.from(0));
        });
    });

    describe("deposit", async function () {
        it("should deposit 100 ether", async function () {
            const tx = await contract
                .connect(accounts[0])
                .deposit({ value: utils.parseEther("100") });
            await tx.wait();

            expect(await provider.getBalance(contract.address)).to.be.equal(
                BigNumber.from(utils.parseEther("100")),
            );
        });
    });

    describe("withdraw", async function () {
        it("should block withdraw before 1 day", async function () {
            const tx = await contract
                .connect(accounts[1])
                .deposit({ value: utils.parseEther("200") });
            await tx.wait();

            expect(await provider.getBalance(contract.address)).to.be.equal(
                BigNumber.from(utils.parseEther("200")),
            );

            await expect(
                contract.connect(accounts[1]).withdraw(),
            ).to.be.revertedWith("cannot withdraw yet");
        });

        it("should allow withdraw after 1 day", async function () {
            const originalBalance = await provider.getBalance(
                accounts[1].address,
            );
            const tx = await contract
                .connect(accounts[0])
                .deposit({ value: utils.parseEther("300") });
            await tx.wait();

            await provider.send("evm_increaseTime", [60 * 60 * 24 + 1]);

            expect(await provider.getBalance(contract.address)).to.be.equal(
                BigNumber.from(utils.parseEther("300")),
            );

            await expect(contract.connect(accounts[1]).withdraw()).to.not.be
                .reverted;

            const balance = await provider.getBalance(accounts[1].address);
            expect(balance).to.be.closeTo(originalBalance, SMALL_ETHER);
        });
    });
});
