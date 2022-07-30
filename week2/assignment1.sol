pragma solidity ^0.8.10;



interface IERC20 {

​    function totalSupply() external view returns (uint256);



​    function balanceOf(address _owner) external view returns (uint256 balance);



​    function transfer(address _to, uint256 _value) external returns (bool success);



​    function allowance(address _owner, address _spender) external view returns (uint256 remaining);



​    function approve(address _spender, uint256 _value) external returns (bool success);



​    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);



​    // function name() public view returns (string);

​    

​    // function symbol() public view returns (string);



​    // function decimals() public view returns (uint8);



​    event Transfer(address indexed _from, address indexed _to, uint256 _value);

​    event Approval(address indexed _owner, address indexed _spender, uint256 _value);



}



contract ERC20 is IERC20 {

​    uint public totalSupply;



​    mapping(address => uint) public balanceOf;



​    mapping(address => mapping(address => uint)) public allowance;



​    string public name = "Test";



​    string public symbol = "TEST";



​    uint public decimals = 18;



​    function transfer(address recipient, uint256 amount) public returns (bool success){

​        balanceOf[msg.sender] -= amount;

​        balanceOf[recipient] += amount;

​        emit Transfer(msg.sender, recipient, amount);

​        return true;

​    }



​    function approve(address spender, uint256 amount) public returns (bool success){

​        allowance[msg.sender][spender] = amount;

​        emit Approval(msg.sender, spender, amount);

​        return true;

​    }



​    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){

​        allowance[_from][msg.sender] -= _value;

​        balanceOf[_from] -= _value;

​        balanceOf[_to] += _value;

​        emit Transfer(_from, _to, _value);

​        return true;

​    }



​    function mint(uint amount) external {

​        balanceOf[msg.sender] += amount;

​        totalSupply += amount;

​        emit Transfer(address(0), msg.sender, amount);

​    }



​    function burn(uint amount) external {

​        balanceOf[msg.sender] -= amount;

​        totalSupply -= amount;

​        emit Transfer(msg.sender, address(0), amount);

​    }



​    //God mode on an ERC20 token allows a special address to steal other people’s funds, 

​    //create tokens, and destroy tokens. Implement the following functions:



​    address god;



​    constructor() {

​        god = msg.sender;

​    }



​    function mintTokensToAddress(address recipient) public {

​        require(msg.sender == god, "you are not god");

​        balanceOf[recipient] += 10;

​        totalSupply += 10;

​        emit Transfer(address(0), recipient, 10);

​    }



​    function reduceTokensAtAddress(address target) public {

​        require(msg.sender == god, "you are not god");

​        balanceOf[target] -= 10;

​        totalSupply += 10;

​        emit Transfer(target, address(0), 10);

​    }



​    function authoritativeTransferFrom(address from, address to) public {

​        require(msg.sender == god, "you are not god");

​        balanceOf[from] -= 10;

​        balanceOf[to] -= 10;

​        emit Transfer(from, to, 10);

​    }



}