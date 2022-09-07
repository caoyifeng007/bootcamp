import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Telephone, TelephoneAttacker } from "../../../typechain-types";

describe("CoinFlip", function() {
    let TelContract: Telephone;
    let TelAttackerContract: TelephoneAttacker;
    let accounts: SignerWithAddress[];

    const DEPLOYER_ID = 3;
    const ATTACKER_ID = 5;

    beforeEach(async function() {
        const TelephoneFactory = await ethers.getContractFactory("Telephone");
        const TelephoneAttackerFactory = await ethers.getContractFactory(
            "TelephoneAttacker",
        );

        accounts = await ethers.getSigners();
        TelContract = await TelephoneFactory.connect(
            accounts[DEPLOYER_ID],
        ).deploy();
        await TelContract.deployTransaction.wait();

        TelAttackerContract = await TelephoneAttackerFactory.connect(
            accounts[ATTACKER_ID],
        ).deploy(TelContract.address);
        await TelAttackerContract.deployTransaction.wait();
    });

    describe("Telephone", async function() {
        it("Victim address should be right", async function() {
            expect(await TelAttackerContract.telephone()).to.be.equals(
                TelContract.address,
            );
        });

        it("before attack owner not change", async function() {
            expect(await TelContract.owner()).to.be.equal(
                accounts[DEPLOYER_ID].address,
            );
        });

        it("after attack owner has changed", async function() {
            const attackTx = await TelAttackerContract.connect(
                accounts[ATTACKER_ID],
            ).attack();
            await attackTx.wait();

            expect(await TelContract.owner()).to.be.equal(
                TelAttackerContract.address,
            );
        });
    });
});
