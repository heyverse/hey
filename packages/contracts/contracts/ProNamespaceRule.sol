// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {INamespaceRule} from "lens-contracts/contracts/core/interfaces/INamespaceRule.sol";
import {KeyValue} from "lens-contracts/contracts/core/types/Types.sol";

contract ProNamespaceRule is INamespaceRule {
    string private constant REQUIRED_USERNAME = "yoginth";

    function configure(bytes32, KeyValue[] calldata) external override {}

    function processCreation(
        bytes32,
        address,
        address,
        string calldata username,
        KeyValue[] calldata,
        KeyValue[] calldata
    ) external pure override {
        require(
            keccak256(abi.encodePacked(username)) ==
                keccak256(abi.encodePacked(REQUIRED_USERNAME))
        );

        revert("Not implemented");
    }

    function processRemoval(
        bytes32,
        address,
        string calldata,
        KeyValue[] calldata,
        KeyValue[] calldata
    ) external pure override {
        revert("Not implemented");
    }

    function processAssigning(
        bytes32,
        address,
        address,
        string calldata,
        KeyValue[] calldata,
        KeyValue[] calldata
    ) external pure override {
        revert("Not implemented");
    }

    function processUnassigning(
        bytes32,
        address,
        address,
        string calldata,
        KeyValue[] calldata,
        KeyValue[] calldata
    ) external pure override {
        revert("Not implemented");
    }
}
