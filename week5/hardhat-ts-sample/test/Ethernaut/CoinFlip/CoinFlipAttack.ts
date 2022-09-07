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
            const flipTx = await AttackContract.magicGuess();
            // 参考Greater的setGreeting,因为是发送tx了,所以需要wait等待tx上链
            await flipTx.wait();
            expect(await CoinContract.consecutiveWins()).to.be.equal(
                BigNumber.from("1"),
            );
        });

        /* 
            Q: I see no way to obtain the return value of a non-view function (ethers.js) 
            A1: The return-value of a non-constant (neither pure nor view) function is available only when the function is called on-chain (i.e., from this contract or from another contract). 
            所以需要使用callStatic
            https://ethereum.stackexchange.com/a/88122

            ethersjs: https://docs.ethers.io/v5/single-page/#/v5/api/contract/contract/-%23-contract-callStatic

            Rather than executing the state-change of a transaction, it is possible to ask a node to pretend that a call is not state-changing and return the result.
            This does not actually change any state, but is free. This in some cases can be used to determine if a transaction will fail or succeed.
         */
        it("should be true", async function() {
            const answer = await AttackContract.callStatic.magicGuess();
            expect(answer).to.be.true;
        });
    });
});
