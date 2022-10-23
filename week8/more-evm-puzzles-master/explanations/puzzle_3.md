```assembly
############
# Puzzle 3 #
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
11      93        SWAP4
12      5A        GAS
13      F4        DELEGATECALL
14      6005      PUSH1 05
16      54        SLOAD
17      60AA      PUSH1 AA
19      14        EQ
1A      601E      PUSH1 1E
1C      57        JUMPI
1D      FE        INVALID
1E      5B        JUMPDEST
1F      00        STOP
```





line16表示加载slot5的值，并且值为aa

因为是使用delegatecall调用contract的runtime部分，而delegatecall的用法就是把called合约中的代码放到calling合约中执行，所以这里只需要在runtime部分中将slot5的值设为aa就可以了

先构建runtime部分，这部分代码就是将slot5的值设为aa，因为也不需要返回值，所以offset和size都是0，这是[构建好的playground](https://www.evm.codes/playground?fork=grayGlacier&unit=Wei&codeType=Bytecode&code='60aa60055560006000f3'_)

对应的bytecode为：60aa60055560006000f3

```assembly
[00]	PUSH1	aa
[02]	PUSH1	05
[04]	SSTORE	
[05]	PUSH1	00
[07]	PUSH1	00
[09]	RETURN	
```

构建好runtime的bytecode后构建initialization部分，这是[构建好的playground](https://www.evm.codes/playground?fork=grayGlacier&unit=Wei&codeType=Bytecode&code='6960aa~555~0~0f3~052~a6016f3'~600%01~_)

```assembly
[00]	PUSH10	60aa60055560006000f3
[0b]	PUSH1	00
[0d]	MSTORE	
[0e]	PUSH1	0a
[10]	PUSH1	16
[12]	RETURN
```

这部分代码的作用就是返回runtime部分的bytecode，以使之后执行DELEGATECALL来调用它

initialization部分的bytecode位：6960aa60055560006000f3600052600a6016f3

所以这个作为参数输入puzzle就完成了

