// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

/*
Forcing Ether with selfdestruct
Code
Preventative techniques
*/

contract Foo {
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract Bar {
    function kill(address payable addr) public payable {
        selfdestruct(addr);
    }
}
