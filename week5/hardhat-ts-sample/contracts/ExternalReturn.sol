// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract ExternalReturn {
    mapping(address => uint256) balances;

    function transfer(address _from, address _to) external returns (bool) {
        balances[_to] += 1;
        return true;
    }
}
