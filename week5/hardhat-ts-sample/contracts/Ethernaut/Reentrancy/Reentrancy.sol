// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Reentrance {
    using SafeMath for uint256;
    mapping(address => uint) public balances;

    function donate(address _to) public payable {
        balances[_to] = balances[_to].add(msg.value);
    }

    function balanceOf(address _who) public view returns (uint balance) {
        return balances[_who];
    }

    function withdraw(uint _amount) public {
        if (balances[msg.sender] >= _amount) {
            (bool result, ) = msg.sender.call{value: _amount}("");
            if (result) {
                _amount;
            }

            // 这里需要注意一下, 原来的代码是0.6.0，并且没有这个unchecked
            // 0.8新版本算术溢出会revert，所以导致重入攻击失败
            // 这里使用0.8版本，并且使用unchecked来模拟0.6的行为
            unchecked {
                balances[msg.sender] -= _amount;
            }
        }
    }

    receive() external payable {}
}
