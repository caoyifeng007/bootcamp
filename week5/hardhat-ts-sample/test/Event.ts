import { expect } from "chai";
import { ethers } from "hardhat";
import { Event } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Event", function () {
    let contract: Event;
    let accounts: SignerWithAddress[];
    beforeEach(async function () {
        const factory = await ethers.getContractFactory("Event");
        contract = await factory.deploy();
        await contract.deployTransaction.wait();

        accounts = await ethers.getSigners();
    });

    describe("emitAddressEvent", async function () {
        it("should emit the msg.sender", async function () {
            await expect(contract.emitEventWithAddress())
                .to.emit(contract, "ImportantMessage")
                .withArgs(accounts[0].address);
        });
    });

    describe("emitEmpytMessage", async function () {
        it("should emit an argument-less event", async function () {
            await expect(contract.emitEmptyMessage())
                .to.emit(contract, "EmptyMessage")
                .withArgs();
        });
    });
});
