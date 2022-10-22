```assembly
############
# Puzzle 2 #
############

00      36        CALLDATASIZE
01      6000      PUSH1 00
03      6000      PUSH1 00
05      37        CALLDATACOPY
06      36        CALLDATASIZE
07      6000      PUSH1 00
09      6000      PUSH1 00
0B      F0        CREATE
0C      6000      PUSH1 00
0E      80        DUP1
0F      80        DUP1
10      80        DUP1
11      80        DUP1
12      94        SWAP5
13      5A        GAS
14      F1        CALL
15      3D        RETURNDATASIZE
16      600A      PUSH1 0A
18      14        EQ
19      601F      PUSH1 1F
1B      57        JUMPI
1C      FE        INVALID
1D      FE        INVALID
1E      FE        INVALID
1F      5B        JUMPDEST
20      00        STOP
```





line15的RETURNDATASIZE opcode是获得前一个message call的返回值的字节数，因为line14是CALL，line16是与0x0a比较，所以可以得出，我们输入的合约的runtime需要返回10个字节

所以剩下的就很简单了，我们的输入由两部分组成：合约的initialization部分以及合约的runtime部分

先构建runtime部分，这部分代码就是返回10个任意字节，这是[构建好的playground](https://www.evm.codes/playground?fork=grayGlacier&unit=Wei&codeType=Bytecode&code='69~~~~~600052600a6016f3'~ffff%01~_)

对应的bytecode为：69ffffffffffffffffffff600052600a6016f3

```assembly
[00]	PUSH10	ffffffffffffffffffff
[0b]	PUSH1	  00
[0d]	MSTORE	
[0e]	PUSH1	  0a
[10]	PUSH1	  16
[12]	RETURN
```

构建好runtime的bytecode后构建initialization部分，这是[构建好的playground](https://www.evm.codes/playground?fork=grayGlacier&unit=Wei&codeType=Bytecode&code='7269~~~~~z0a6016f3z13600df3'~ffffz60005260%01z~_)

```assembly
[00]	PUSH19	69ffffffffffffffffffff600052600a6016f3
[14]	PUSH1	  00
[16]	MSTORE	
[17]	PUSH1	  13
[19]	PUSH1	  0d
[1b]	RETURN
```

这部分代码的作用就是返回runtime部分的bytecode，以使之后执行CALL来调用它

initialization部分的bytecode位：7269ffffffffffffffffffff600052600a6016f36000526013600df3

所以这个作为参数输入puzzle就完成了







