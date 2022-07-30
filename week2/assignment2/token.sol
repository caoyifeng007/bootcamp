// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ERC20.sol";

/**
Congratulations! The government wants to use your smart contract ERC20 tokens now for transferring economic value!

However, they require the ability to prevent transfers to blacklisted addresses from occurring, and they want addresses on a blacklist to not be able to transfer their funds until they are removed from the blacklist.

Hint: what is the appropriate data structure to store this blacklist?

Hint: make sure only the government can control this list!
 */

contract GovernmentToken is ERC20 {
    address federalReserve;
    mapping(address => bool) blacklist;

    constructor() ERC20("GVT", "#") {
        federalReserve = msg.sender;
    }

    modifier isFederalReserve() {
        require(msg.sender == federalReserve, "you are not allowed.");
        _;
    }

    modifier isNoInBlackList() {
        require(!blacklist[msg.sender], "you are in jail.");
        _;
    }

    function addBlackList(address addr) public isFederalReserve {
        blacklist[addr] = true;
    }

    function removeBlackList(address addr) public isFederalReserve {
        blacklist[addr] = false;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override isNoInBlackList {
        // require(!blacklist[msg.sender], "you are in jail.");
    }
}
