import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Accounts } from "../typechain-types";

describe("Accounts", function () {
    let contract: Accounts;
    let accounts: SignerWithAddress[];

    const DEPLOYER_ID = 3;
    const ATTACKER_ID = 5;
    const NEW_ADMIN = 4;

    beforeEach(async function () {
        const ContractFactory = await ethers.getContractFactory("Accounts");

        accounts = await ethers.getSigners();
        // 使用connect来指定发送交易的address
        contract = await ContractFactory.connect(
            // 注意，这里没有使用 .address
            accounts[DEPLOYER_ID],
        ).deploy();
        await contract.deployTransaction.wait();

        // 默认使用第一个账号，这里可以打印看一下
        // console.log(await contract.admin());
    });

    describe("admin", async function () {
        it("should be account 3", async function () {
            expect(await contract.admin())
                .to.be.a("string")
                .equal(accounts[DEPLOYER_ID].address);
        });
    });

    describe("changeAdmin", async function () {
        context("rejecting the sender", async function () {
            it("should accept admin", async function () {
                await expect(
                    contract
                        .connect(accounts[ATTACKER_ID])
                        .changeAdmin(accounts[ATTACKER_ID].address),
                ).to.be.revertedWith("only admin");
            });
        });

        context("accepting the sender", async function () {
            it("should accept sender", async function () {
                await expect(
                    contract
                        .connect(accounts[DEPLOYER_ID])
                        .changeAdmin(accounts[NEW_ADMIN].address),
                ).to.be.not.reverted;
            });

            expect(await contract.admin())
                .to.be.a("string")
                .equal(accounts[NEW_ADMIN].address);
        });
    });
});
