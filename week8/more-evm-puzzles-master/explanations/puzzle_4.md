```assembly
############
# Puzzle 4 #
############

00      30        ADDRESS
01      31        BALANCE
02      36        CALLDATASIZE
03      6000      PUSH1 00
05      6000      PUSH1 00
07      37        CALLDATACOPY
08      36        CALLDATASIZE
09      6000      PUSH1 00
0B      30        ADDRESS
0C      31        BALANCE
0D      F0        CREATE
0E      31        BALANCE
0F      90        SWAP1
10      04        DIV
11      6002      PUSH1 02
13      14        EQ
14      6018      PUSH1 18
16      57        JUMPI
17      FD        REVERT
18      5B        JUMPDEST
19      00        STOP
```





line0 和 line1 在最开始获取当前calling地址的余额并存在栈的最底部

lineD 的CREATE opcode有3个参数，lineB和lineC再次获取了当前calling地址的余额并将其作为CREATE的第一个参数，在创建新合约的时候传入其中作为新合约的余额

CREATE执行之后会在栈中留下新合约的地址，这时在这个地址之上执行BALANCE就是获取新合约的余额

lineF 到 line13 就是想表达calling的余额除以新合约的余额为2

根据CREATE opcode的定义，执行CREATE时候会执行新合约的initialization部分代码，返回runtime部分代码，当下次合约被call的时候执行，所以这里思路就是在initialization中将新合约余额的一半发到0地址上烧掉

直接使用yul来编写solution

```solidity
// SPDX-License-Identifier: GPL-3.0

object "Solution" {
    code {
        let s := call(0, 0x0000000000000000000000000000000000000000, div(selfbalance(), 2), 0, 0, 0, 0)       
    }

}
```

使用yul compiler编译，点击Compilation Details下边的Bytecode

```json
{
	"functionDebugData": {},
	"generatedSources": [],
	"linkReferences": {},
	"object": "60008060008060024704600080f150",
	"opcodes": "PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x2 SELFBALANCE DIV PUSH1 0x0 DUP1 CALL POP ",
	"sourceMap": "169:1:0:-:0;166;163;160;156;141:13;137:21;93:42;90:1;85:86;66:118"
}
```

先输入value值4，再输入object中的bytecode完成puzzle



