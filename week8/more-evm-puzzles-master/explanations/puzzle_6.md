```assembly
############
# Puzzle 6 #
############

00      7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0      PUSH32 FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0
21      34                                                                      CALLVALUE
22      01                                                                      ADD
23      6001                                                                    PUSH1 01
25      14                                                                      EQ
26      602A                                                                    PUSH1 2A
28      57                                                                      JUMPI
29      FD                                                                      REVERT
2A      5B                                                                      JUMPDEST
2B      00                                                                      STOP
```









FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0 + value = 1

一个非常明显的overflow溢出问题，+ F + 1 +1，所以输入17溢出变为1