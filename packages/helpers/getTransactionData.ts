import type {
  Eip712TransactionRequest,
  Eip1559TransactionRequest
} from "@hey/indexer";

interface GetTransactionDataOptions {
  sponsored?: boolean;
}

const getTransactionData = (
  raw: Eip1559TransactionRequest | Eip712TransactionRequest,
  options: GetTransactionDataOptions = {}
) => {
  const data = {
    data: raw.data,
    gas: BigInt(raw.gasLimit),
    maxFeePerGas: BigInt(raw.maxFeePerGas),
    maxPriorityFeePerGas: BigInt(raw.maxPriorityFeePerGas),
    nonce: raw.nonce,
    to: raw.to,
    value: BigInt(raw.value)
  } as any;

  if (options.sponsored && "customData" in raw) {
    data.paymaster = raw.customData.paymasterParams?.paymaster;
    data.paymasterInput = raw.customData.paymasterParams?.paymasterInput;
  }

  return data;
};

export default getTransactionData;
