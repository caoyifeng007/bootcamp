// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract TimeLock {
    uint256 public constant DURATION = 1 days;

    struct AccountInfo {
        uint256 balance;
        uint256 lastDeposit;
    }

    mapping(address => AccountInfo) public accounts;

    function deposit() external payable {
        accounts[msg.sender].balance += msg.value;
        //
        accounts[msg.sender].lastDeposit = block.timestamp;
    }

    function withdraw() external {
        require(
            block.timestamp - accounts[msg.sender].lastDeposit > DURATION,
            "cannot withdraw yet"
        );

        // always update the internal state first before making an external call
        uint256 _balance = accounts[msg.sender].balance;

        payable(msg.sender).transfer(_balance);
    }
}
