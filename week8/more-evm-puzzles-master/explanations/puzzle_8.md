```assembly
############
# Puzzle 8 #
############

00      34        CALLVALUE
01      15        ISZERO
02      19        NOT
03      6007      PUSH1 07
05      57        JUMPI
06      FD        REVERT
07      5B        JUMPDEST
08      36        CALLDATASIZE
09      6000      PUSH1 00
0B      6000      PUSH1 00
0D      37        CALLDATACOPY
0E      36        CALLDATASIZE
0F      6000      PUSH1 00
11      6000      PUSH1 00
13      F0        CREATE
14      47        SELFBALANCE
15      6000      PUSH1 00
17      6000      PUSH1 00
19      6000      PUSH1 00
1B      6000      PUSH1 00
1D      47        SELFBALANCE
1E      86        DUP7
1F      5A        GAS
20      F1        CALL
21      6001      PUSH1 01
23      14        EQ
24      6028      PUSH1 28
26      57        JUMPI
27      FD        REVERT
28      5B        JUMPDEST
29      47        SELFBALANCE
2A      14        EQ
2B      602F      PUSH1 2F
2D      57        JUMPI
2E      FD        REVERT
2F      5B        JUMPDEST
30      00        STOP
```









line0 - line2 表示value不能为0

line8 - line13 表示创建一个新合约

line14 - line20 表示调用合约，在调用的同时将当前context中的余额作为第三个参数传入合约中，合约runtime返回值为1，且在runtime中将合约中的余额再transfer回给当前context，因为line29和line2A需要调用前和调用后的当前context的余额相等

使用yul编写solution代码

```solidity
// SPDX-License-Identifier: GPL-3.0

object "Solution" {
    code {
        datacopy(0, dataoffset("runtime"), datasize("runtime"))
        return(0, datasize("runtime"))        
    }

    object "runtime" {
        
        code {
        	// 这里转回去不行，需要再探讨一下
        	// let res := call(gas(), caller(), selfbalance(), 0, 0, 0, 0)
            selfdestruct(caller())
        }
    }
}
```

```json
{
	"functionDebugData": {},
	"generatedSources": [],
	"linkReferences": {},
	"object": "6002600d60003960026000f3fe33ff",
	"opcodes": "PUSH1 0x2 PUSH1 0xD PUSH1 0x0 CODECOPY PUSH1 0x2 PUSH1 0x0 RETURN INVALID CALLER SELFDESTRUCT ",
	"sourceMap": "111:19:0:-:0;88:21;85:1;76:55;150:19;147:1;140:30"
}
```

核心思想是在执行的过程中selfdestruct，把余额都返回给caller，这样外部context中的余额就保持一致了