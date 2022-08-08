const { ethers } = require('ethers')

const JsonRpcProvider = 'https://rinkeby.infura.io/v3/0c43527032d94ad4a6332aee7a2bef82'
const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider)

const senderPK = 'de982a3f252280315f34f5233b2be61b89e7e6e6801c4b04a4bfa0c1c7d31fda'
const sender = '0x7FA7fB4D35f0F4F3959A65098D1D9Cf69E49Ac48'
const receiver = '0x9A30dD98a7359d60B8f35971C859ee81E9717F54'

const LinkContractAddr = '0x01be23585060835e02b77ef475b0cc51aa1e0709'
const ERC20_ABI = [
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function balanceOf(address _owner) public view returns (uint256 balance)",
    "function transfer(address _to, uint256 _value) public returns (bool success)",
    "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
    "function approve(address _spender, uint256 _value) public returns (bool success)",
    "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
]

const contract = new ethers.Contract(LinkContractAddr, ERC20_ABI, provider)

const wallet = new ethers.Wallet(senderPK, provider)

const main = async ()=> {
    const senderBeforeBalance = await contract.balanceOf(sender)
    const receiverBeforeBalance = await contract.balanceOf(receiver)
    console.log(ethers.utils.formatEther(senderBeforeBalance));
    console.log(ethers.utils.formatEther(receiverBeforeBalance));

    const cw = contract.connect(wallet)
    const tx = await cw.transfer(receiver, "1")
    await tx.wait()
    
    console.log(tx);

    const senderAfterBalance = await contract.balanceOf(sender)
    const receiverAfterBalance = await contract.balanceOf(receiver)
    console.log(ethers.utils.formatEther(senderAfterBalance));
    console.log(ethers.utils.formatEther(receiverAfterBalance));

}

main()