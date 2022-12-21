import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyYulIERC1155 } from "../typechain-types";
import { JsonRpcProvider, BaseProvider } from "@ethersproject/providers";

const { utils } = ethers;

describe("BalanceTest", function() {
    let a: MyYulIERC1155;
    let accounts: SignerWithAddress[];
    let provider: JsonRpcProvider;

    const DEPLOYER_ID = 3;
    const NEW_ADMIN = 4;

    beforeEach(async function() {
        const YulFactory = await ethers.getContractFactory("MyYulIERC1155");

        accounts = await ethers.getSigners();
        let yulContract = await YulFactory
        // await yulcon.deployTransaction.wait();
    });

    describe("balance", async function() {
        it("before: balance of b contract should have 1 ether", async function() {
            const balance = await provider.getBalance(b.address);
            expect(balance).to.be.equal(
                ethers.BigNumber.from(utils.parseEther("1")),
            );
        });
    });
});
