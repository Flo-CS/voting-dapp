// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

// Don't know why, but solidity can't resolve the import without node_modules
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}
}
