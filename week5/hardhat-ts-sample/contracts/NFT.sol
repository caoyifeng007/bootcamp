// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NFT is ERC1155 {
    uint256 public constant SWORD = 0;

    constructor() ERC1155("https://asdfasdfasdf") {
        _mint(msg.sender, SWORD, 1, "");
    }
}
