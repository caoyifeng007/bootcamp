import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
const { BigNumber } = ethers;
import { CoinFlip, CoinFlipAttack } from "../../../typechain-types";

describe("CoinFlip", function() {
    let CoinContract: CoinFlip;
    let AttackContract: CoinFlipAttack;
    let accounts: SignerWithAddress[];

    const DEPLOYER_ID = 3;
    const ATTACKER_ID = 5;
    const NEW_ADMIN = 4;

    beforeEach(async function() {
        const CoinContractFactory = await ethers.getContractFactory("CoinFlip");
        const AttackContractFactory = await ethers.getContractFactory(
            "CoinFlipAttack",
        );

        accounts = await ethers.getSigners();
        // 使用connect来指定发送交易的address
        CoinContract = await CoinContractFactory.connect(
            // 注意，这里没有使用 .address
            accounts[DEPLOYER_ID],
        ).deploy();
        await CoinContract.deployTransaction.wait();

        AttackContract = await AttackContractFactory.connect(
            accounts[DEPLOYER_ID],
        ).deploy(CoinContract.address);
        await AttackContract.deployTransaction.wait();
    });

    describe("Attacker", async function() {
        it("Victim address should be right", async function() {
            expect(await AttackContract.coinFlip()).to.be.equals(
                CoinContract.address,
            );
        });

        it("flip coin should be win", async function() {
            const answer = await AttackContract.magicGuess();
            expect(await CoinContract.consecutiveWins()).to.be.equal(
                BigNumber.from("1"),
            );
        });
    });
});
