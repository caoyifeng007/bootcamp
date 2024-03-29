import { expect } from "chai";
import { ethers } from "hardhat";
import { BlockNumber } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { JsonRpcProvider, BaseProvider } from "@ethersproject/providers";

const { utils, BigNumber } = ethers;

describe("BlockNumber", function() {
  let contract: BlockNumber;
  let accounts: SignerWithAddress[];
  let provider: JsonRpcProvider;

  beforeEach(async function() {
    const factory = await ethers.getContractFactory("BlockNumber");
    contract = await factory.deploy();
    await contract.deployTransaction.wait();

    accounts = await ethers.getSigners();
    provider = await ethers.provider;
  });

  describe("gambleOnTenthBlockNumber", async function() {
    it("should reject 0.5 ether", async function() {
      await provider.send("hardhat_mine", [utils.hexValue(1000)]);

      await expect(
        contract.gambleOnTenthBlockNumber({
          value: utils.parseEther("0.5"),
        })
      ).to.be.revertedWith("not degen enough");
    });

    // it("should rejectj if the contract has less than 1 ether", async function () {
    //     await provider.send("hardhat_mine", [utils.hexValue(1000)]);

    //     await expect(
    //         contract.gambleOnTenthBlockNumber({
    //             value: utils.parseEther("1"),
    //         }),
    //     ).to.be.revertedWith("can't gamble with you");
    // });

    it("should revert if the user bets before cooldown time", async function() {
      await provider.send("hardhat_mine", [utils.hexValue(1000)]);

      await contract.gambleOnTenthBlockNumber({
        value: utils.parseEther("1"),
      });

      await provider.send("hardhat_mine", [utils.hexValue(1)]);

      await expect(
        contract.gambleOnTenthBlockNumber({
          value: utils.parseEther("1"),
        })
      ).to.be.revertedWith("wait for cooldown time");
    });

    it("should accept 1 ether", async function() {
      await provider.send("hardhat_mine", [utils.hexValue(1000)]);

      await contract.gambleOnTenthBlockNumber({
        value: utils.parseEther("1"),
      });
    });
  });

  describe("claimWinnings", async function() {
    it("should revet if block.number too small", async function() {
      const tx = await contract
        .connect(accounts[0])
        .gambleOnTenthBlockNumber({ value: utils.parseEther("1") });
      tx.wait();

      await provider.send("hardhat_mine", [utils.hexValue(19)]);

      await expect(contract.claimWinnings()).to.be.revertedWith("too early");
    });

    it("should revet if block.number too large", async function() {
      const tx = await contract
        .connect(accounts[0])
        .gambleOnTenthBlockNumber({ value: utils.parseEther("1") });
      tx.wait();

      await provider.send("hardhat_mine", [utils.hexValue(150)]);

      await expect(contract.claimWinnings()).to.be.revertedWith("too late");
    });

    it("should accept claimWinnings", async function() {
      //   const originalBalance = await provider.getBalance(accounts[0].address);

      const tx = await contract
        .connect(accounts[0])
        .gambleOnTenthBlockNumber({ value: utils.parseEther("1") });
      tx.wait();

      await provider.send("hardhat_mine", [utils.hexValue(100)]);

      await expect(contract.connect(accounts[0]).claimWinnings()).to.not
        .reverted;

      //   expect(await provider.getBalance(accounts[0].address)).to.be.closeTo(
      //     originalBalance,
      //     utils.parseEther("0.02")
      //   );
    });
  });
});
