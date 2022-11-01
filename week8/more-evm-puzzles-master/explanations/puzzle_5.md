```assembly
############
# Puzzle 5 #
############

00      6020      PUSH1 20
02      36        CALLDATASIZE
03      11        GT
04      6008      PUSH1 08
06      57        JUMPI
07      FD        REVERT
08      5B        JUMPDEST
09      36        CALLDATASIZE
0A      6000      PUSH1 00
0C      6000      PUSH1 00
0E      37        CALLDATACOPY
0F      36        CALLDATASIZE
10      59        MSIZE
11      03        SUB
12      6003      PUSH1 03
14      14        EQ
15      6019      PUSH1 19
17      57        JUMPI
18      FD        REVERT
19      5B        JUMPDEST
1A      00        STOP
```





line0 - line3  calldata size > 0x20

MSIZE:  Get the size of active memory in bytes

line9 - line12  active memory size - calldata size = 3



这个puzzle的关键点在于memory是以32个字节为单位扩张的，我们这里构造一个由93个ff组成的calldata，可以看到calldata的长度为93，但是所开辟的memory却需要3个slot，即32*3

所以上边 active memory size - calldata size = 3 等式成立



length = 32*3 - 3 = 93

ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff







