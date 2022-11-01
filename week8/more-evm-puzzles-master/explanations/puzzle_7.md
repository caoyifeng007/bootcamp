```assembly
############
# Puzzle 7 #
############

00      5A        GAS
01      34        CALLVALUE
02      5B        JUMPDEST
03      6001      PUSH1 01
05      90        SWAP1
06      03        SUB
07      80        DUP1
08      6000      PUSH1 00
0A      14        EQ
0B      6011      PUSH1 11
0D      57        JUMPI
0E      6002      PUSH1 02
10      56        JUMP
11      5B        JUMPDEST
12      5A        GAS
13      90        SWAP1
14      91        SWAP2
15      03        SUB
16      60A6      PUSH1 A6
18      14        EQ
19      601D      PUSH1 1D
1B      57        JUMPI
1C      FD        REVERT
1D      5B        JUMPDEST
1E      00        STOP
```







参考链接：https://ventral.digital/posts/2022/6/6/more-evm-puzzles-part-3

```assembly
00      5A        GAS           2gas  │
01      34        CALLVALUE     2gas  │
02      5B        JUMPDEST      1gas  ┢━<━┓
03      6001      PUSH1 01      3gas  ┃    ┃
05      90        SWAP1         3gas  ┃    ┃
06      03        SUB           3gas  ┃    ┃
07      80        DUP1          3gas  ┃    ┃
08      6000      PUSH1 00      3gas  ┃    ┃
0A      14        EQ            3gas  ┃    ┃
0B      6011      PUSH1 11      3gas  ┃    ┃
0D      57        JUMPI        10gas  ┠--------┐
0E      6002      PUSH1 02      3gas  ┃    ┃  ┃
10      56        JUMP          8gas  ┗━>━┛  ┃
11      5B        JUMPDEST      1gas  <──────---┘
12      5A        GAS           2gas
```



稍微整理一下逻辑就是 value - 1 = 0，就会继续往下执行，如果不为0就会跳回line2重复line2 到 line10这个循环，line1获取了最初的gas值，经过一系列运行之后第二次获取了gas'值，并且要满足这个等式 gas - gas' = 0xa6

即，只需要计算运行中gas的消耗就行了

line0 - line1  4 gas

line2 - line10 43 gas    跳回line2的循环

line2 - lineD 32 gas    最后一次跳到lineD

这里有个需要注意的点是GAS opcode获取在它之前消耗的gas，不包括它自身消耗的2个gas，所以最终等式可写为:

4 + 43 * (value - 1) + 32 + 1 = 166

计算出value为4

