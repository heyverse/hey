import type { Eip1559TransactionRequest } from "@hey/indexer";

/**
 * Retrieves the transaction data for a self-funded transaction.
 *
 * @param raw The raw transaction data.
 * @returns The transaction data for a self-funded transaction.
 */
const selfFundedTransactionData = (raw: Eip1559TransactionRequest) => {
  return {
    data: raw.data,
    gas: BigInt(raw.gasLimit),
    maxFeePerGas: BigInt(raw.maxFeePerGas),
    maxPriorityFeePerGas: BigInt(raw.maxPriorityFeePerGas),
    nonce: raw.nonce,
    to: raw.to,
    value: BigInt(raw.value)
  };
};

export default selfFundedTransactionData;
