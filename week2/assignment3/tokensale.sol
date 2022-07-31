// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ERC20.sol";

/**
Add a function where users can mint 1000 tokens if they pay 1 ether.

IMPORTANT: your token should have 18 decimal places as is standard in ERC20 tokens

IMPORTANT: your total supply should not exceed 1 million tokens. The sale should close after 1 million tokens have been minted

IMPORTANT: you must have a function to withdraw the ethereum from the contract to your address
 */

contract TokenSale is ERC20 {
    address tokenOwner;

    constructor() ERC20("SaleT", "#") {
        tokenOwner = msg.sender;
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    modifier isOwner() {
        require(msg.sender == tokenOwner, "you are not owner.");
        _;
    }

    receive() external payable {
        payable(tokenOwner).transfer(1 ether);
        payable(msg.sender).transfer(msg.value - 1 ether);
        transfer(msg.sender, 1000 * decimals());

        emit Transfer(tokenOwner, msg.sender, 1000 * decimals());
    }

    function payableMint() public payable {
        require(balanceOf(tokenOwner) >= 1000 * decimals(), "sale closed.");
        require(msg.value >= 1 ether, "not enough ether.");
    }

    function withDraw() public isOwner {
        payable(msg.sender).transfer(tokenOwner.balance);
    }
}
