// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract Event {
    event ImportantMessage(address);
    event EmptyMessage();

    function emitEventWithAddress() external {
        emit ImportantMessage(msg.sender);
    }

    function emitEmptyMessage() external {
        emit EmptyMessage();
    }
}
