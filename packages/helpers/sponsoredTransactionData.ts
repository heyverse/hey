import type { Eip712TransactionRequest } from "@hey/indexer";

/**
 * Retrieves the transaction data for a sponsored transaction.
 *
 * @param {Eip712TransactionRequest} raw - The raw transaction data.
 * @returns {Object} The transaction data for a sponsored transaction.
 */
const sponsoredTransactionData = (raw: Eip712TransactionRequest) => {
  return {
    data: raw.data,
    gas: BigInt(raw.gasLimit),
    maxFeePerGas: BigInt(raw.maxFeePerGas),
    maxPriorityFeePerGas: BigInt(raw.maxPriorityFeePerGas),
    nonce: raw.nonce,
    paymaster: raw.customData.paymasterParams?.paymaster,
    paymasterInput: raw.customData.paymasterParams?.paymasterInput,
    to: raw.to,
    value: BigInt(raw.value)
  };
};

export default sponsoredTransactionData;
