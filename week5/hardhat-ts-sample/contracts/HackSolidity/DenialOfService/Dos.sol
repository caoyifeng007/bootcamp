// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

/* Denial of Service
Denial of service by rejecting to accept Ether
Code and Demo
Preventative technique (Push vs Pull)
 */

contract KingOfEther {
    address public king;
    uint public balance;
    // new
    mapping(address => uint) public balances;

    // Alice sends 1 ether (King = Alice, balance = 1 ether)
    // Bob   sends 2 ether

    function claimThrone() external payable {
        require(msg.value > balance, "Need to pay more to become the king");

        // old
        // (bool sent, ) = king.call{value: balance}("");
        // require(sent, "Failed to send Ether");
        // new
        balances[king] += balance;

        balance = msg.value;
        king = msg.sender;
    }

    function withdraw() public {
        require(msg.sender != king, "Current king kannot withdraw");

        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}

contract Attack {
    function attack(KingOfEther kingOfEther) public payable {
        kingOfEther.claimThrone{value: msg.value}();
    }
}
