// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct KeyValue {
    bytes32 key;
    bytes value;
}

interface INamespaceRule {
    function configure(
        bytes32 configSalt,
        KeyValue[] calldata ruleParams
    ) external;

    function processCreation(
        bytes32 configSalt,
        address originalMsgSender,
        address account,
        string calldata username,
        KeyValue[] calldata primitiveParams,
        KeyValue[] calldata ruleParams
    ) external;

    function processRemoval(
        bytes32 configSalt,
        address originalMsgSender,
        string calldata username,
        KeyValue[] calldata primitiveParams,
        KeyValue[] calldata ruleParams
    ) external;

    function processAssigning(
        bytes32 configSalt,
        address originalMsgSender,
        address account,
        string calldata username,
        KeyValue[] calldata primitiveParams,
        KeyValue[] calldata ruleParams
    ) external;

    function processUnassigning(
        bytes32 configSalt,
        address originalMsgSender,
        address account,
        string calldata username,
        KeyValue[] calldata primitiveParams,
        KeyValue[] calldata ruleParams
    ) external;
}

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
