import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Acontract, Bcontract, Ccontract } from "../../typechain-types";

const { utils } = ethers;

describe("BalanceTest", function() {
    let a: Acontract;
    let b: Bcontract;
    let c: Ccontract;
    let accounts: SignerWithAddress[];
    // let provider: ethers.providers.JsonRpcProvider;

    const DEPLOYER_ID = 3;
    const ATTACKER_ID = 5;
    const NEW_ADMIN = 4;

    beforeEach(async function() {
        const AFactory = await ethers.getContractFactory("Acontract");
        const BFactory = await ethers.getContractFactory("Bcontract");
        const CFactory = await ethers.getContractFactory("Ccontract");

        accounts = await ethers.getSigners();
        a = await AFactory.deploy();
        await a.deployTransaction.wait();

        c = await CFactory.deploy();
        await c.deployTransaction.wait();

        b = await BFactory.deploy(c.address);
        await b.deployTransaction.wait();

        const oneEtherInHex = utils.hexStripZeros(
            utils.parseEther("1").toHexString(),
        );
        await ethers.provider.send("hardhat_setBalance", [
            b.address,
            oneEtherInHex,
        ]);
    });

    describe("balance", async function() {
        it("before: balance of b contract should have 1 ether", async function() {
            const balance = await ethers.provider.getBalance(b.address);
            expect(balance).to.be.equal(
                ethers.BigNumber.from(utils.parseEther("1")),
            );
        });

        it("after: balance of b contract should have 2 ether", async function() {
            const tx = await a.t(b.address, { value: utils.parseEther("1") });
            await tx.wait();

            const balance = await ethers.provider.getBalance(b.address);
            expect(balance).to.be.equal(
                ethers.BigNumber.from(utils.parseEther("2")),
            );
        });

        it("balance of c contract should have 0 ether", async function() {
            const tx = await a.t(b.address, { value: utils.parseEther("1") });
            await tx.wait();

            const balance = await ethers.provider.getBalance(c.address);
            expect(balance).to.be.equal(
                ethers.BigNumber.from(utils.parseEther("0")),
            );
        });
    });
});
