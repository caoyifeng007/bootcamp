// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

interface IYulERC1155 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);

    function uri(uint256 id) external view returns (string memory);

    function setURI(string memory newuri) external;

    function balanceOf(
        address account,
        uint256 id
    ) external view returns (uint256);

    function balanceOfBatch(
        address[] memory accounts,
        uint256[] memory ids
    ) external view returns (uint256[] memory);

    function setApprovalForAll(address operator, bool approved) external;

    function isApprovedForAll(
        address account,
        address operator
    ) external view returns (bool);

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external;

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external;

    function burn(address from, uint256 id, uint256 amount) external;

    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external;
}
