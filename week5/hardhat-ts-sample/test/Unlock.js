// import { expect } from "chai";
// import { ethers, network } from "hardhat";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { JsonRpcProvider } from "@ethersproject/providers";

const { expect } = require("chai");
const { ethers, network } = require("hardhat");

const DAI_ADDR = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const EXG_ADDR = "0x075e72a5eDf65F0A5f44699c7654C1a76941Ddc8";

describe("Unlock", function() {
  //   let contract: Event;
  let accounts;
  let exg_account;
  let DAI_Contract;
  let provider;
  // let accounts: SignerWithAddress[];
  // let exg_account: SignerWithAddress;
  // let provider: JsonRpcProvider;

  beforeEach(async function() {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [EXG_ADDR],
    });

    DAI_Contract = await ethers.getContractAt("IERC20", DAI_ADDR);
    exg_account = await ethers.getSigner(EXG_ADDR);

    accounts = await ethers.getSigners();
    // provider = await ethers.provider;
  });

  describe("unlock exchange account", async function() {
    it("should unlock the account", async () => {
      const amount = 100n * 10n ** 18n;
      console.log(amount);
    });
  });
});
