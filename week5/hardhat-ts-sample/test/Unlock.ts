import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { IERC20 } from "../typechain-types";

const DAI_ADDR = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const EXG_ADDR = "0x075e72a5eDf65F0A5f44699c7654C1a76941Ddc8";

describe("Unlock", function () {
    let accounts: SignerWithAddress[];
    let exg_account: SignerWithAddress;
    let DAI_Contract: IERC20;
    let provider: JsonRpcProvider;

    beforeEach(async function () {
        provider = await ethers.provider;

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [EXG_ADDR],
        });

        exg_account = await ethers.getSigner(EXG_ADDR);
        DAI_Contract = await ethers.getContractAt("IERC20", DAI_ADDR);

        accounts = await ethers.getSigners();
    });

    describe("unlock exchange account", async function () {
        it("should unlock the account", async () => {
            // The "n" at the end of an integer literal merely suggests that the value is a bigint primitive.
            // Bigint values (introduced in ES10) are used to represent arbitrarily large integers.
            const amount = 100n * 10n ** 18n;

            console.log(
                "DAI balance of EXG before",
                await DAI_Contract.balanceOf(EXG_ADDR),
            );
            console.log(
                "DAI balance of account 0 before",
                await DAI_Contract.balanceOf(accounts[0].address),
            );

            await DAI_Contract.connect(exg_account).transfer(
                accounts[0].address,
                amount,
            );

            console.log(
                "DAI balance of EXG after",
                await DAI_Contract.balanceOf(EXG_ADDR),
            );
            console.log(
                "DAI balance of account 0 after",
                await DAI_Contract.balanceOf(accounts[0].address),
            );

            expect(
                await DAI_Contract.balanceOf(accounts[0].address),
            ).to.be.equal(amount.toString());
        });
    });
});
