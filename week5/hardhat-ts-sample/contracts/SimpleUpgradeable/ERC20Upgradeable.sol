//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// 这里注意 Initializable 要放在最左边,作为 most base-like
contract MyTokenUpgradeable is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable
{
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
