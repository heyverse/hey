import type {
  Eip712TransactionRequest,
  Eip1559TransactionRequest
} from "@hey/indexer";
import type { Address, Hex } from "viem";

interface GetTransactionDataOptions {
  sponsored?: boolean;
}

interface TransactionData {
  data: Hex;
  gas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  nonce: number;
  to: Address;
  value: bigint;
  paymaster?: Address;
  paymasterInput?: Hex;
}

const getTransactionData = (
  raw: Eip1559TransactionRequest | Eip712TransactionRequest,
  options: GetTransactionDataOptions = {}
): TransactionData => {
  const data: TransactionData = {
    data: raw.data as Hex,
    gas: BigInt(raw.gasLimit),
    maxFeePerGas: BigInt(raw.maxFeePerGas),
    maxPriorityFeePerGas: BigInt(raw.maxPriorityFeePerGas),
    nonce: raw.nonce,
    to: raw.to as Address,
    value: BigInt(raw.value)
  };

  if (options.sponsored && "customData" in raw) {
    data.paymaster = raw.customData.paymasterParams?.paymaster as
      | Address
      | undefined;
    data.paymasterInput = raw.customData.paymasterParams?.paymasterInput as
      | Hex
      | undefined;
  }

  return data;
};

export default getTransactionData;
