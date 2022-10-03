Key point of this puzzle is the byte size of code return by contract address, for this point I've referenced an [answer in StackOverflow](https://ethereum.stackexchange.com/q/121749)

So, the [keycode](https://www.evm.codes/playground?fork=grayGlacier&unit=Wei&codeType=Bytecode&code='60016000F3'_) can be executed in EVM Playground.

```assembly
60016000F3


[00]	PUSH1	01  // line1
[02]	PUSH1	00
[04]	RETURN
```

line1 will make EXTCODESIZE opcode return 1, so the output after EQ is 1, then jump to JUMPDEST to finish the puzzle.