```assembly
############
# Puzzle 1 #
############

00      36      CALLDATASIZE   
01      34      CALLVALUE      
02      0A      EXP
03      56      JUMP
04      FE      INVALID        
05      FE      INVALID        
.......... 中间全是INVALID
3E      FE      INVALID
3F      FE      INVALID
40      5B      JUMPDEST
41      58      PC
42      36      CALLDATASIZE
43      01      ADD
44      56      JUMP
45      FE      INVALID
46      FE      INVALID
47      5B      JUMPDEST
48      00      STOP
```



程序开始之前stack为空

+---------+
|             |
+---------+
|             |
+---------+

假设我们输入的calldata为x，输入的value为y

+---------+
| size(x) |
+---------+
|             |
+---------+

那么在执行**CALLDATASIZE** opcode之后stack会变为如上所示

+---------+
|      y     |
+---------+
|  size(x) |
+---------+

在执行完**CALLVALUE** opcode之后stack会变为如上所示

+---------+
|  result |
+---------+
|             |
+---------+

在执行完**EXP** opcode会以stack第一个值为底，第二个值为幂做指数运算，执行后stack会变为如上所示，此时 result = y ^ size(x)，再继续往下走

+---------+
|  result |
+---------+
|             |
+---------+

result就是**JUMP** opcode执行完之后所要跳转的目标index，从代码上可以看到第一个**JUMPDEST**的index是0x40，所以这里的result就应该为0x40，再继续往下走

+---------+
|     41    |
+---------+
|             |
+---------+

**PC** opcode会将当前这条opcode的offset值推入stack内，**PC**前的index值是0x41，所以执行后的stack如上所示

+---------+
|     41    |
+---------+
| size(x) |
+---------+

那么在执行**CALLDATASIZE** opcode之后stack会变为如上所示

+---------+
| result2 |
+---------+
|             |
+---------+

那么在执行**ADD** opcode之后stack会变为如上所示，此时 result2 = 0x41 + size(x)

+---------+
| result2 |
+---------+
|             |
+---------+

result2就是第二个**JUMP** opcode执行完之后所要跳转的目标index，从代码上可以看到第二个**JUMPDEST**的index是0x47，所以这里的result就应该为0x47

所以我们得到两个等式：

result = y ^ size(x)       (1)

0x47 = 0x41 + size(x)   (2)

size(x) = 6, y = 2

从第二个等式可以知道我们输入的calldata应该是6个字节的长度，代入到第一个等式可以得出y的值为2

所以calldata可以输入 112233445566， value输入2



