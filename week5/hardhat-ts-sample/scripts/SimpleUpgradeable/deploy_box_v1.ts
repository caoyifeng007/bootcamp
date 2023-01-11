import { ethers, upgrades } from "hardhat";

// https://www.npmjs.com/package/@openzeppelin/hardhat-upgrades
// upgrades插件setup可参考上边链接的文档

// deploy代码部分来自于Week 13 Simple upgrade tutorial with hardhat
async function main() {
    const BoxFactory = await ethers.getContractFactory("Box");
    // 视频里deployProxy方法设置了第三个参数,{initializer: "initialize"}
    // 文档里没有,所以这里可以认为它是默认执行Box合约中的Initialize方法
    // This will automatically check that the Box contract is upgrade-safe,
    // set up a proxy admin (if needed), deploy an implementation contract for the Box contract
    // (unless there is one already from a previous deployment),
    // create a proxy, and initialize it by calling initialize(42).
    const box = await upgrades.deployProxy(BoxFactory, [42]);
    await box.deployed();
    console.log("Box deployed to:", box.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
