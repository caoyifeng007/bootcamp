import { ethers, upgrades } from "hardhat";

const PROXY = "0x01d6da440e353e86762ff07bd2c1c22aee2bd6a6";

async function main() {
    const UnsafeV2Factory = await ethers.getContractFactory("UnsafeV2");
    console.log("Deploying Unsafe V2...");

    const unsafeV2 = await upgrades.upgradeProxy(PROXY, UnsafeV2Factory, {
        constructorArgs: [111],
    });

    console.log("Unsafe V2 upgraded");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
