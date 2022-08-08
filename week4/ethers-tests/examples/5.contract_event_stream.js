const { ethers } = require('ethers')

const JsonRpcProvider = 'https://mainnet.infura.io/v3/0c43527032d94ad4a6332aee7a2bef82'
const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider)

const DaiContractAddr = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
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

    "event Transfer(address indexed _from, address indexed _to, uint256 _value)",
    "event Approval(address indexed _owner, address indexed _spender, uint256 _value)"

]

const contract = new ethers.Contract(DaiContractAddr, ERC20_ABI, provider)


const main = async ()=> {

    const latestBlockNum = await provider.getBlockNumber()

    const transferEvents = await contract.queryFilter('Transfer', latestBlockNum - 10, latestBlockNum)
    console.log(transferEvents);
}

main()