Guessing an 8-bit number is apparently too easy. This time, you need to predict the entire 256-bit block hash for a future block.

```solidity
pragma solidity ^0.4.21;

contract PredictTheBlockHashChallenge {
    address guesser;
    bytes32 guess;
    uint256 settlementBlockNumber;

    function PredictTheBlockHashChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(bytes32 hash) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = hash;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        bytes32 answer = block.blockhash(settlementBlockNumber);

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
```





参考链接：https://cmichel.io/capture-the-ether-solutions/

solidity文档上[blockhash](https://docs.soliditylang.org/en/latest/cheatsheet.html)的定义如下：

blockhash(uint blockNumber) returns (bytes32)`: hash of the given block - only works for **256** most recent blocks

意思是只返回最近的256个区块的哈希值，超过的都会返回0，所以**lockInGuess**中传入32个0，0x0000000000000000000000000000000000000000000000000000000000000000，然后等257个区块之后再调用**settle**就行了



