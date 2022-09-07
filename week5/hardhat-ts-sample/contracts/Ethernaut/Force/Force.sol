// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Force {
    /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/

    // empty contract does not generate by typechain
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
