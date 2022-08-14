import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleTransfer } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { JsonRpcProvider, BaseProvider } from "@ethersproject/providers";

const { utils } = ethers;

describe("SimpleTransfer ", function () {
    let contract: SimpleTransfer;
    let accounts: SignerWithAddress[];
    let provider: JsonRpcProvider;
    beforeEach(async function () {
        const factory = await ethers.getContractFactory("SimpleTransfer");
        contract = await factory.deploy();
        await contract.deployTransaction.wait();

        accounts = await ethers.getSigners();
        // don't do this, it will connect to the mainnet!
        // You could actually get provider via this mechanism, and this is what you might do inside of your web app
        // But if you do this inside of your HRE, it weill connect to the mainnet and your test will not work
        // provider = await ethers.getDefaultProvider();

        // provider is what gives you the interface for manipulating the blockchain that we running locally
        provider = await ethers.provider;
        // RPC protocol doesn't allow the leading zeros
        const twentyThousandEtherInHex = utils.hexStripZeros(
            utils.parseEther("20000").toHexString(),
        );

        await provider.send("hardhat_setBalance", [
            accounts[0].address,
            twentyThousandEtherInHex,
        ]);
    });

    context("initial conditions", async function () {
        it("should have zero balance", async function () {
            const balance = await provider.getBalance(contract.address);
            expect(balance).to.be.equal(ethers.BigNumber.from(0));
        });

        it("account 0 should have 20,000 ether", async function () {
            const balance = await provider.getBalance(accounts[0].address);
            expect(balance).to.be.equal(
                ethers.BigNumber.from(utils.parseEther("20000")),
            );
        });
    });

    describe("deposit", async function () {
        it.skip("should deposit 10,000 ether", async function () {
            const tx = await contract
                .connect(accounts[0])
                .deposit({ value: utils.parseEther("10000") });
            await tx.wait();

            expect(await provider.getBalance(contract.address)).to.be.equal(
                ethers.BigNumber.from(utils.parseEther("10000")),
            );
            expect(await provider.getBalance(accounts[0].address)).to.be.equal(
                ethers.BigNumber.from(utils.parseEther("10000")),
            );
        });

        it("should deposit 10,000 ether", async function () {
            const tx = await contract
                .connect(accounts[0])
                .deposit({ value: utils.parseEther("10000") });
            await tx.wait();

            expect(await provider.getBalance(contract.address)).to.be.equal(
                ethers.BigNumber.from(utils.parseEther("10000")),
            );
        });
    });

    describe("withdraw", async function () {
        it("should deposit 10,000 ether", async function () {
            const tx = await contract
                .connect(accounts[0])
                .deposit({ value: utils.parseEther("10000") });
            await tx.wait();

            expect(await provider.getBalance(contract.address)).to.be.equal(
                ethers.BigNumber.from(utils.parseEther("10000")),
            );

            const txWithdraw = await contract.connect(accounts[0]).withdraw();
            await txWithdraw.wait();

            expect(await provider.getBalance(contract.address)).to.be.equal(
                ethers.BigNumber.from(0),
            );

            expect(
                await provider.getBalance(accounts[0].address),
            ).to.be.closeTo(
                ethers.BigNumber.from(utils.parseEther("20000")),
                ethers.BigNumber.from(utils.parseEther("0.001")),
            );
        });
    });
});
