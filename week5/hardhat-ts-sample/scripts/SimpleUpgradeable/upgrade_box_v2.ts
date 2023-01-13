import { ethers, upgrades } from "hardhat";

// https://www.npmjs.com/package/@openzeppelin/hardhat-upgrades
// upgrades插件setup可参考上边链接的文档

// proxy 合约地址
const PROXY = "0xFA7A518D42123871E8eB96C905381293328c9797";

async function main() {
    const BoxV2 = await ethers.getContractFactory("BoxV2");

    const box = await upgrades.upgradeProxy(PROXY, BoxV2);

    console.log("Box upgraded");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
