// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

contract EtherGame {
    uint public targetAmount = 7 ether;
    address public winner;
    uint public balance;

    function deposit() public payable {
        require(msg.value == 1 ether, "You can only send 1 ether");

        // old
        // uint balance = address(this).balance;
        // new
        balance += msg.value;
        require(balance <= targetAmount, "Game is over");

        if (balance == targetAmount) {
            winner = msg.sender;
        }
    }

    function claimReward() public {
        require(msg.sender == winner, "Not winner");

        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract Attack {
    function attack(address payable target) public payable {
        selfdestruct(target);
    }
}
