unsafe (constructor, initialize more than once, reorder storage, kill/selfdestruct)

Q: Why is having a constructor inside the implementation unsafe?

A: Implementataion 中的constructor就算执行了也是将implementation中的state variable更新，并不会更新proxy中的state variable，而且为了安全，implementation中的Initialize也只会执行一次

##### [What does it mean for a contract to be ungrade safe?](https://docs.openzeppelin.com/upgrades-plugins/1.x/faq#what-does-it-mean-for-a-contract-to-be-upgrade-safe)

When deploying a proxy for a contract, there are some limitations to the contract code. In particular, the contract cannot have a constructor, and should not use the `selfdestruct` or `delegatecall` operations for security reasons.

As a replacement for the constructor, it is common to set up an `initialize` function to take care of the contract’s initialization. You can use the [`Initializable`](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#initializers) base contract to have access to an `initializer` modifier that ensures the function is only called once.

```solidity
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
// Alternatively, if you are using @openzeppelin/contracts-upgradeable:
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyContract is Initializable {
  uint256 value;
  function initialize(uint256 initialValue) public initializer {
    value = initialValue;
  }
}
```

Both plugins will validate that the contract you are trying to deploy complies with these rules. You can read more about how to write upgrade safe contracts [here](https://docs.openzeppelin.com/upgrades/2.8/writing-upgradeable).

here ->

##### [Writing Upgradeable Contracts](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable)

When working with upgradeable contracts using OpenZeppelin Upgrades, there are a few minor caveats to keep in mind when writing your Solidity code.

###### Initializers

You can use your Solidity contracts with OpenZeppelin Upgrades without any modifications, except for their *constructors*. Due to a requirement of the proxy-based upgradeability system, no constructors can be used in upgradeable contracts. **To learn about the reasons behind this restriction, head to [Proxies](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#the-constructor-caveat).**

Proxies ->

[The Constructor Caveat](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#the-constructor-caveat)

In Solidity, code that is inside a constructor or part of a global variable declaration is not part of a deployed contract’s runtime bytecode. This code is executed only once, when the contract instance is deployed. As a consequence of this, the code within a logic contract’s constructor will never be executed in the context of the proxy’s state. To rephrase, proxies are completely oblivious to the existence of constructors. It’s simply as if they weren’t there for the proxy.



```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UnsafeV1 {
    // 下边这三行代码尽管不在constructor中,但是在部署时会被执行
    // 也相当于在constructor中执行了
    // 这样的代码在deploy的时候会被openzeppelin tool检测出来unsafe,所以并不会被部署
    // Unsafe - constructor
    address public owner;
    uint public val = 123;
    uint public start = block.timestamp;

    constructor() {
        owner = msg.sender;
    }
}
```

```sh
npx hardhat run scripts/SimpleUpgradeable/deploy_unsafe_v1.ts

Deploying Unsafe V1...
Error: Contract `contracts/SimpleUpgradeable/UnsafeV1.sol:UnsafeV1` is not upgrade safe

contracts/SimpleUpgradeable/UnsafeV1.sol:17: Contract `UnsafeV1` has a constructor
    Define an initializer instead
    https://zpl.in/upgrades/error-001

contracts/SimpleUpgradeable/UnsafeV1.sol:14: Variable `val` is assigned an initial value
    Move the assignment to the initializer
    https://zpl.in/upgrades/error-004

contracts/SimpleUpgradeable/UnsafeV1.sol:17: Variable `start` is assigned an initial value
    Move the assignment to the initializer
    https://zpl.in/upgrades/error-004
```

上边合约是unsafe的，所以在部署的时候会被openzeppelin检测出来并报错，从而导致部署失败

```solidity
contract UnsafeV1 {
    address public owner;
    uint public val;
    uint public start;

    // constructor() {
    //     owner = msg.sender;
    // }
}
```

改成这样就可以了



```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 这个地方不要用这个library,可以参考这个issue:
// https://forum.openzeppelin.com/t/interacting-with-uups-upgradeable-contracts-in-test-throwing-contract-is-not-upgrade-safe-use-of-delegatecall-is-not-allowed/32743/4
// import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract UnsafeV1 is Initializable {
    // constant 是safe的,因为constant变量不存储在storage中
    // 存储于代码中,所以是safe的
    // Safe - constants and immutables
    uint public constant MY_CONSTANT = 111;

    // immutable 也是safe的,理由和上边的constant一样
    // 告诉openzeppelin tools 这个immutalbe赋值没问题
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint public immutable MY_IMMUTABLE;

    // 下边这三行代码尽管不在constructor中,但是在部署时会被执行
    // 也相当于在constructor中执行了
    // 这样的代码在deploy的时候会被openzeppelin tool检测出来unsafe,所以并不会被部署
    // Unsafe - constructor
    address public owner;
    // uint public val = 123;
    uint public val;
    // uint public start = block.timestamp;
    uint public start;

    // immutable变量可以在constructor中初始化
    // 告诉openzeppelin tools 这个constructor没问题
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(uint _x) {
        // owner = msg.sender;
        MY_IMMUTABLE = _x;
    }

    /** 其实不需要我们自己写这个 modifier, openzeppelin已经提供了 */
    // bool public initialized;

    // modifier notInitialized() {
    //     require(!initialized, "already initialized");
    //     _;
    //     initialized = true;
    // }

    // 我们需要保证这个Initialize只会在deploy的时候执行一次
    // Initialize - replaces constructor, can only call once
    // function initialize(uint _val) external notInitialized {
    //     owner = msg.sender;
    //     val = _val;
    //     start = block.timestamp;
    // }

    /** openzeppelin 的写法, 导入Initializable.sol, 继承Initializable, 并使用openzeppelin提供的modifier */
    function initialize(uint _val) external initializer {
        owner = msg.sender;
        val = _val;
        start = block.timestamp;
    }
}
```

```sh
npx hardhat run scripts/SimpleUpgradeable/deploy_unsafe_v1_2.ts

Deploying Unsafe V1...
Unsafe V1 deployed to: 0x01d6da440E353e86762Ff07bD2C1c22aEe2BD6A6
```

上边经过调整的UnsafeV1就可以通过部署了



```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract UnsafeV2 is Initializable {
    uint public constant MY_CONSTANT = 111;

    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint public immutable MY_IMMUTABLE;

    // Unsafe - constructor
    uint public val;
    // 这个地方,owner和val两个state variable和UnsafeV1相比
    // 交换顺序了,所以也会被openzeppelin检测出unsafe
    address public owner;
    uint public start;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(uint _x) {
        MY_IMMUTABLE = _x;
    }

    /** openzeppelin 的写法, 导入Initializable.sol, 继承Initializable, 并使用openzeppelin提供的modifier */
    function initialize(uint _val) external initializer {
        owner = msg.sender;
        val = _val;
        start = block.timestamp;
    }
}
```

UnsafeV2相比于UnsafeV1，修改了val和owner的顺序，所以在upgrade的时候会被检测出来，报layout is incompatible错误

```sh
npx hardhat run scripts/SimpleUpgradeable/deploy_unsafe_v2.ts

Deploying Unsafe V2...
Error: New storage layout is incompatible

UnsafeV1: Deleted `owner`
  > Keep the variable even if unused

contracts/SimpleUpgradeable/UnsafeV2.sol:19: Inserted `owner`
  > New variables should be placed after all existing inherited variables
```







```solidity
// Unsafe - selfdesctruct
function kill() external {
	selfdestruct(payable(address(0)));
}
```

合约中有selfdestruct也是unsafe的，会被检测出来

```sh
npx hardhat run scripts/SimpleUpgradeable/deploy_unsafe_v1.ts

Deploying Unsafe V1...
Error: Contract `contracts/SimpleUpgradeable/UnsafeV1.sol:UnsafeV1` is not upgrade safe

contracts/SimpleUpgradeable/UnsafeV1.sol:76: Use of selfdestruct is not allowed
    https://zpl.in/upgrades/error-003
```

