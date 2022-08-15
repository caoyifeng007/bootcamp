// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract BlockNumber {
    uint256 public constant MIN_BLOCKS_AHEAD = 10;
    uint256 public constant MAX_BLOCKS_AHEAD = 110;

    mapping(address => uint256) public degenToBlockNumberBet;

    function gambleOnTenthBlockNumber() external payable {
        require(msg.value == 1 ether, "not degen enough");
        // 这里是: 只要有人发送了1ETH进来,那么这个require就为true
        // require(address(this).balance >= 1 ether, "can't gamble with you");
        require(
            block.number > degenToBlockNumberBet[msg.sender] + MAX_BLOCKS_AHEAD,
            "wait for cooldown time"
        );
        degenToBlockNumberBet[msg.sender] = block.number + MIN_BLOCKS_AHEAD;
    }

    function claimWinnings() external {
        console.log(block.number);
        require(
            block.number > MIN_BLOCKS_AHEAD + degenToBlockNumberBet[msg.sender],
            "too early"
        );
        require(
            block.number <=
                MAX_BLOCKS_AHEAD + degenToBlockNumberBet[msg.sender],
            "too late"
        );
        if (uint256(blockhash(degenToBlockNumberBet[msg.sender])) % 2 == 0) {
            payable(msg.sender).transfer(1 ether);
        }
    }
}
