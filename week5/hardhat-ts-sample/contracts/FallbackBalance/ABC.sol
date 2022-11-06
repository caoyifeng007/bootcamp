// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Acontract {
    constructor() payable {}

    function t(address addr) external payable {
        (bool sent, ) = addr.call{value: msg.value}("");
    }
}

contract Bcontract {
    address public c;

    constructor(address addr) {
        c = payable(addr);
    }

    fallback() external payable {
        console.log(payable(address(this)).balance);
        (bool sent, ) = c.call{value: 0}("");
        console.log(payable(address(this)).balance);
    }
}

contract Ccontract {
    fallback() external payable {}
}
