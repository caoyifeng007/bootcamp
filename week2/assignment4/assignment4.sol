// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ERC20.sol";

/**
Take what you did in assignment 4 and give the users the ability to transfer their tokens to the contract and receive 0.5 ether for every 1000 tokens they transfer.

ERC20 tokens don’t have the ability to trigger functions on smart contracts. 
Users need to give the smart contract approval to withdraw their ERC20 tokens from their balance.
See here: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L136

The smart contract should block the transaction if the smart contract does not have enough ether to pay the user.
If another user wants to buy tokens from the contract, and the supply has already been used up, and the contract is holding tokens that other people sent in, it must sell them those tokens at the original price of 1 ether per 1000 tokens.
 */

contract Exchange is ERC20 {
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

    function buyToken() public payable {
        require(
            balanceOf(tokenOwner) >= 1000 * decimals(),
            "token is dold out."
        );
        require(msg.value >= 1 ether, "not enough ether.");
    }

    function withDraw() public isOwner {
        payable(msg.sender).transfer(tokenOwner.balance);
    }

    function sellToken(uint256 amount) public {
        uint256 n = amount % 1000;
        require(n >= 1, "not enough tokens.");
        require(
            balanceOf(msg.sender) >= n * 1000 * decimals(),
            "you do not have enough token"
        );
        require(
            tokenOwner.balance >= n * 0.5 ether,
            "exchange doesn't have enough ether."
        );

        payable(msg.sender).transfer(n * 0.5 ether);
        transfer(tokenOwner, n * 1000 * decimals());

        emit Transfer(msg.sender, tokenOwner, n * 1000 * decimals());
    }
}
