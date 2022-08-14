import { expect } from "chai";
import { ethers } from "hardhat";
import { ExternalReturn } from "../typechain-types";

describe("ExternalReturn", function () {
    let contract: ExternalReturn;
    beforeEach(async function () {
        const BGCF = await ethers.getContractFactory("ExternalReturn");
        contract = await BGCF.deploy();
        await contract.deployTransaction.wait();
    });

    describe("transfer(address,address)", async function () {
        it("should return true for non-zero recipient", async function () {
            // const tx1 = await contract.transfer(`
            //     "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            //     "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            // );
            // console.log(tx1);`

            const tx = await contract.callStatic.transfer(
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            );

            // expect(tx).to.be.true;
            expect(tx).to.be.equal(true);
        });
    });
});
