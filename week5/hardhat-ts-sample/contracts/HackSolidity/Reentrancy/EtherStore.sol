// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/*
Reentrancy
- What is reentrancy?
- Remix code and demo
- Preventative techniques
*/

contract EtherStore {
    mapping(address => uint) balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount);

        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] -= _amount;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
