// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract BigNumbers {
    uint256 public number;

    function setNumber(uint256 newNumber) external {
        number = newNumber;
    }

    function setToTheMax() external {
        number = type(uint256).max;
    }

    function getNumber() external view returns (uint256) {
        return number;
    }
}
