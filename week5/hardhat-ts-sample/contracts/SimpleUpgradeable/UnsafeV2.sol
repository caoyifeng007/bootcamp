// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract UnsafeV2 is Initializable {
    uint public constant MY_CONSTANT = 111;

    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint public immutable MY_IMMUTABLE;

    // Unsafe - constructor
    uint public val;
    // 这个地方,owner和val两个state variable和UnsafeV1相比
    // 交换顺序了,所以也会被openzeppelin检测出unsafe
    address public owner;
    uint public start;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(uint _x) {
        MY_IMMUTABLE = _x;
    }

    /** openzeppelin 的写法, 导入Initializable.sol, 继承Initializable, 并使用openzeppelin提供的modifier */
    function initialize(uint _val) external initializer {
        owner = msg.sender;
        val = _val;
        start = block.timestamp;
    }
}
