import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumbers } from "../typechain-types";
const { BigNumber } = ethers;

describe("BigNumbers", function () {
    let contract: BigNumbers;
    beforeEach(async function () {
        const BGCF = await ethers.getContractFactory("BigNumbers");
        contract = await BGCF.deploy();
        await contract.deployTransaction.wait();
    });

    describe("getNumber", async function () {
        // Bad
        it("should get zero", async function () {
            // 这里是 { BigNumber: 0 }
            console.log(await contract.getNumber());
            expect(await contract.getNumber()).to.be.equal(0);
        });
    });

    // Bad
    describe("setToTheMax Bad", async function () {
        it.skip("should set the number to the maximum", async function () {
            const tx = await contract.setToTheMax();
            await tx.wait();

            expect(await contract.getNumber()).to.be.equal(
                115792089237316195423570985008687907853269984665640564039457584007913129639935,
            );
        });
    });

    // Good
    describe("setToTheMax Good", async function () {
        it("should set the number to the maximum", async function () {
            const tx = await contract.setToTheMax();
            await tx.wait();

            expect(await contract.getNumber()).to.be.equal(
                BigNumber.from(
                    "115792089237316195423570985008687907853269984665640564039457584007913129639935",
                ),
            );
        });
    });
});
