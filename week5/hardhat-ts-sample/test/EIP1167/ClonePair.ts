import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Pair, PairFactory } from "../../typechain-types";

import { Signer, utils } from "ethers";

const { formatBytes32String, getAddress } = utils;

const DAI_ADDRESS = getAddress("0x6b175474e89094c44da98b954eedeac495271d0f");
const WETH_ADDRESS = getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");

describe("EIP1167 use case Test", function() {
    const setup = async () => {
        const salts = [formatBytes32String("0"), formatBytes32String("1")];

        const accounts = await ethers.getSigners();

        const PairFactory = await ethers.getContractFactory("Pair");
        const PairFactoryFactory = await ethers.getContractFactory(
            "PairFactory",
        );

        const pairMaster = await PairFactory.deploy();
        const cloneFactory = await PairFactoryFactory.deploy(
            pairMaster.address,
        );

        return { salts, accounts, cloneFactory };
    };

    describe("hello test", async function() {
        let salts: string[], accounts: Signer[], cloneFactory: PairFactory;
        beforeEach(async function() {
            ({ salts, accounts, cloneFactory } = await loadFixture(setup));
        });

        it("should ", async function() {
            const pairAddress = await cloneFactory.getPairAddress(salts[0]);

            const tx = await cloneFactory.createPair(salts[0]);
            await tx.wait();

            const pair1 = new ethers.Contract(
                pairAddress,
                [
                    "function initialize(address _tokenA, address _tokenB) public",
                    "function getPair() external view returns (address[] memory)",
                ],
                accounts[1],
            ) as Pair;

            const initTx = await pair1.initialize(DAI_ADDRESS, WETH_ADDRESS);
            await initTx.wait();

            const tokens = await pair1.getPair();

            expect(tokens[0]).to.be.equal(DAI_ADDRESS);
            expect(tokens[1]).to.be.equal(WETH_ADDRESS);
        });
    });
});
