```solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MY") {}

    function mint(address to, uint amount) external onlyOwner {
        _mint(to, amount);
    }
}
```

```solidity
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyTokenUpgradeable is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    // constructor is unsafe, so it's replaced by initialize
    // constructor() ERC20("MyToken", "MY") {
    // }

    function initialize() external initializer {
        __ERC20_init("MyToken", "MY");
        __Ownable_init();
    }

    function mint(address to, uint amount) external onlyOwner {
        _mint(to, amount);
    }
}
```

