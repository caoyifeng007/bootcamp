Key point of this puzzle is to make sure contract initialize code and runtime code, according to CALL opcode, it will return 1 when code revert, so we need to push INVALID opcode to memory in initialization.



```assembly
60FD60005360016000f3

[00]	PUSH1	FD
[02]	PUSH1	00
[04]	MSTORE8	
[05]	PUSH1	01
[07]	PUSH1	00
[09]	RETURN
```



The code above is put INVALID(FD) into memory and return it, when actually calling this contract, it will revert directly.