const { ethers } = require("ethers");
const INFURA_ID = '0c43527032d94ad4a6332aee7a2bef82'
const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${INFURA_ID}`)


const sender = '0x7FA7fB4D35f0F4F3959A65098D1D9Cf69E49Ac48'
const receiver = '0x9A30dD98a7359d60B8f35971C859ee81E9717F54'

const senderPK = 'de982a3f252280315f34f5233b2be61b89e7e6e6801c4b04a4bfa0c1c7d31fda'

const wallet = new ethers.Wallet(senderPK, provider)

const readContract = async ()=>{

    const senderBeforeBalance = await provider.getBalance(sender)
    const receiverBeforeBalance = await provider.getBalance(receiver)
    console.log(ethers.utils.formatEther(senderBeforeBalance));
    console.log(ethers.utils.formatEther(receiverBeforeBalance));

    const tx = await wallet.sendTransaction({
        to: receiver,
        value: ethers.utils.parseEther("0.006")
    })
    await tx.wait()
    console.log(tx);

    const senderAfterBalance = await provider.getBalance(sender)
    const receiverAfterBalance = await provider.getBalance(receiver)
    console.log(ethers.utils.formatEther(senderAfterBalance));
    console.log(ethers.utils.formatEther(receiverAfterBalance));

}

readContract()
