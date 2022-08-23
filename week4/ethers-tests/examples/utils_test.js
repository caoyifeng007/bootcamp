const { ethers } = require('ethers')

// https://docs.soliditylang.org/en/latest/abi-spec.html#events
// solidity 文档的Events部分说明了 topic 为什么要这样写
const hash = ethers.utils.id("Transfer(address,address,uint256)")

console.log(hash)
console.log(hash2)