Putting the answer in the code makes things a little too easy.

This time I’ve only stored the hash of the number. Good luck reversing a cryptographic hash!

```solidity
pragma solidity ^0.4.21;

contract GuessTheSecretNumberChallenge {
    bytes32 answerHash = 0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365;

    function GuessTheSecretNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }
    
    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);

        if (keccak256(n) == answerHash) {
            msg.sender.transfer(2 ether);
        }
    }
}
```









solution

https://samsclass.info/141/proj/C604.htm

从guess方法的参数类型 uint8 能看出，n的取值范围是0-255，随意直接暴力破解，做个循环就能找到256个数字中哪个是答案了

```solidity
contract Attacker {
    bytes32 answerHash = 0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365;

    function guess() external view returns(uint8){
        for(uint8 i=0; i<256; i++){
            if(keccak256(i) == answerHash){
            		// 170
                return i;
            }
        }
    }
}
```

