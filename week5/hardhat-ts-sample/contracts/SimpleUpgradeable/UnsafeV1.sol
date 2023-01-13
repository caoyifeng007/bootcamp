// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 不要用下边这个library,这个issue中讨论了为什么会报错:
// https://forum.openzeppelin.com/t/interacting-with-uups-upgradeable-contracts-in-test-throwing-contract-is-not-upgrade-safe-use-of-delegatecall-is-not-allowed/32743/4
// import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

// openzeppelin faq: What does it mean for a contract to be upgrade safe?
// https://docs.openzeppelin.com/upgrades-plugins/1.x/faq#what-does-it-mean-for-a-contract-to-be-upgrade-safe

// You can read more about how to write upgrade safe contracts here:
// https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable
// 上边链接中openzeppelin的Writing Upgradeable Contracts文档也是用下边这个library
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

    // implementation中不能有selfdestruct
    // 如果有,也会被openzeppelin检测出来从而无法部署
    // Unsafe - selfdesctruct
    // function kill() external {
    //     selfdestruct(payable(address(0)));
    // }
}
