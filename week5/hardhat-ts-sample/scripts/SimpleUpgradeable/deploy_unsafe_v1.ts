import { ethers, upgrades } from "hardhat";

async function main() {
    const UnsafeV1Factory = await ethers.getContractFactory("UnsafeV1");
    console.log("Deploying Unsafe V1...");

    const proxy = await upgrades.deployProxy(UnsafeV1Factory, [444], {
        // 这个写法是在部署时,向constructor中传入的参数是999
        // 然后调用initialize,并向其传入444作为参数
        constructorArgs: [999],
    });
    await proxy.deployed();

    console.log("Unsafe V1 deployed to:", proxy.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
