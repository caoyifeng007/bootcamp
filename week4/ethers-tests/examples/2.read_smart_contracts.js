const { ethers } = require("ethers");
const INFURA_ID = '0c43527032d94ad4a6332aee7a2bef82'
const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)

// Dai token address
const DaiTokenAddr = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

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
const readContract = async ()=>{
    const contract = new ethers.Contract(DaiTokenAddr, ERC20_ABI, provider)
    const TokenName = await contract.name();
    console.log(TokenName);
    const totalSupply = await contract.totalSupply();
    console.log(ethers.utils.formatUnits(totalSupply) );
    const userBalance = await contract.balanceOf('0xa560ED8861376bf1484b6c69361154df20fBB98D');
    console.log(ethers.utils.formatEther(userBalance));
}

readContract()
