// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract ReceiverTest is ERC165, IERC1155Receiver {
    bytes public receivedData;

    uint256[] public receivedIds;

    address public receivedOperator;

    address public receivedFrom;

    uint256[] public receivedValues;

    event Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes data
    );
    event BatchReceived(
        address operator,
        address from,
        uint256[] ids,
        uint256[] values,
        bytes data
    );

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4) {
        // receivedData = data;
        emit Received(operator, from, id, value, data);
        return this.onERC1155Received.selector;
    }

    event Log(bytes4 indexed selector);

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4) {
        // receivedOperator = operator;
        // receivedFrom = from;
        // receivedIds = ids;
        // receivedValues = values;
        // receivedData = data;
        emit BatchReceived(operator, from, ids, values, data);

        return this.onERC1155BatchReceived.selector;
    }
}
