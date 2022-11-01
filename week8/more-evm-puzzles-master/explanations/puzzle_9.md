```assembly
############
# Puzzle 9 #
############

00      34        CALLVALUE
01      6000      PUSH1 00
03      52        MSTORE
04      6020      PUSH1 20
06      6000      PUSH1 00
08      20        SHA3
09      60F8      PUSH1 F8
0B      1C        SHR
0C      60A8      PUSH1 A8
0E      14        EQ
0F      6016      PUSH1 16
11      57        JUMPI
12      FD        REVERT
13      FD        REVERT
14      FD        REVERT
15      FD        REVERT
16      5B        JUMPDEST
17      00        STOP
```







keccak256(value)  >> 0xf8 == a8

向右移248位，只留8位，即a8

所以尝试了一些数字，只有keccak256(47)的哈希值开头是a8