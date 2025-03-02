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
    event HeyUsernameCreated(string username);

    function configure(bytes32, KeyValue[] calldata) external override {}

    function processCreation(
        bytes32,
        address originalMsgSender,
        address,
        string calldata username,
        KeyValue[] calldata,
        KeyValue[] calldata ruleParams
    ) external override {
        // Extract payment details from `ruleParams`
        PaymentConfiguration memory paymentConfig = _extractPaymentConfig(
            ruleParams
        );

        // Process payment
        _processPayment(paymentConfig, paymentConfig, originalMsgSender);

        // Emit username creation event
        emit HeyUsernameCreated(username);
    }

    function _extractPaymentConfig(
        KeyValue[] calldata ruleParams
    ) internal pure returns (PaymentConfiguration memory) {
        address token;
        uint256 amount;
        address recipient;

        for (uint256 i = 0; i < ruleParams.length; i++) {
            if (ruleParams[i].key == bytes32("token")) {
                token = abi.decode(ruleParams[i].value, (address));
            } else if (ruleParams[i].key == bytes32("amount")) {
                amount = abi.decode(ruleParams[i].value, (uint256));
            } else if (ruleParams[i].key == bytes32("recipient")) {
                recipient = abi.decode(ruleParams[i].value, (address));
            }
        }

        require(
            token != address(0) && amount > 0 && recipient != address(0),
            "Invalid payment config"
        );

        return
            PaymentConfiguration({
                token: token,
                amount: amount,
                recipient: recipient
            });
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
