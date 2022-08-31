// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

contract A {
    function foo() public {
        (bool sent, ) = msg.sender.call{value: 1 ether}("");
        require(sent, "Failed to send Ether");
        // do something else
    }
}

contract B {
    function callFoo(A a) public {
        a.foo();
    }
}
