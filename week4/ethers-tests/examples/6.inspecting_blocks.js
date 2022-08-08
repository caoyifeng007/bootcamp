const { ethers } = require('ethers')

const JsonRpcProvider = 'https://mainnet.infura.io/v3/0c43527032d94ad4a6332aee7a2bef82'
const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider)


const main = async ()=> {

    const block = await provider.getBlockNumber()

    const blockInfo = await provider.getBlock(block)
    console.log(blockInfo);

    const { transactions } = await provider.getBlockWithTransactions(block)
    console.log(transactions[0]);

}

main()