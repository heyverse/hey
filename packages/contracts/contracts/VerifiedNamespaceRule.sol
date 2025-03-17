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

contract VerifiedNamespaceRule is INamespaceRule {
    address public adminAddress;

    constructor(address _adminAddress) {
        adminAddress = _adminAddress;
    }

    function configure(bytes32, KeyValue[] calldata) external override {}

    function processCreation(
        bytes32,
        address originalMsgSender,
        address account,
        string calldata,
        KeyValue[] calldata,
        KeyValue[] calldata
    ) external override {
        if (originalMsgSender != adminAddress) {
            revert("Not an admin");
        }

        // how to assign username to account as admin?
    }

    function updateAdminAddress(address newAdmin) external {
        if (msg.sender != adminAddress) {
            revert("Not an admin");
        }
        adminAddress = newAdmin;
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
