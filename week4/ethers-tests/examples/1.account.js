const { ethers } = require("ethers");
const INFURA_ID = '0c43527032d94ad4a6332aee7a2bef82'
const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)

const readBalance = async ()=>{
    const balance = await provider.getBalance('0x5C391e318b4EF19bff735C6F13f320822dFB9174')
    // { _hex: '0x03539c4739267c08', _isBigNumber: true }
    console.log(balance)
    // the balance is 0.23970703489620276
    // 和etherscan上个查询是一样的
    console.log(`the balance is ${ethers.utils.formatEther(balance)}`)
}

readBalance()
