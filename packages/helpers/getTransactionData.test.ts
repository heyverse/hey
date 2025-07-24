import type {
  Eip712TransactionRequest,
  Eip1559TransactionRequest
} from "@hey/indexer";
import { describe, expect, it } from "vitest";
import getTransactionData from "./getTransactionData";

const base1559 = {
  data: "0x00",
  gasLimit: 21000,
  maxFeePerGas: 100n,
  maxPriorityFeePerGas: 2n,
  nonce: 1,
  to: "0xabc" as any,
  value: 0n
} as any as Eip1559TransactionRequest;

const base712 = {
  ...base1559,
  customData: {
    paymasterParams: {
      paymaster: "0xdef",
      paymasterInput: "0x123"
    }
  }
} as any as Eip712TransactionRequest;

describe("getTransactionData", () => {
  it("handles Eip1559TransactionRequest", () => {
    const result = getTransactionData(base1559);
    expect(result).toEqual({
      data: "0x00",
      gas: 21000n,
      maxFeePerGas: 100n,
      maxPriorityFeePerGas: 2n,
      nonce: 1,
      to: "0xabc",
      value: 0n
    });
  });

  it("excludes paymaster fields when not sponsored", () => {
    const result = getTransactionData(base712);
    expect(result).toEqual({
      data: "0x00",
      gas: 21000n,
      maxFeePerGas: 100n,
      maxPriorityFeePerGas: 2n,
      nonce: 1,
      to: "0xabc",
      value: 0n
    });
  });

  it("includes paymaster fields when sponsored", () => {
    const result = getTransactionData(base712, { sponsored: true });
    expect(result).toEqual({
      data: "0x00",
      gas: 21000n,
      maxFeePerGas: 100n,
      maxPriorityFeePerGas: 2n,
      nonce: 1,
      paymaster: "0xdef",
      paymasterInput: "0x123",
      to: "0xabc",
      value: 0n
    });
  });

  it("ignores sponsored flag for Eip1559TransactionRequest", () => {
    const result = getTransactionData(base1559, { sponsored: true });
    expect(result).toEqual({
      data: "0x00",
      gas: 21000n,
      maxFeePerGas: 100n,
      maxPriorityFeePerGas: 2n,
      nonce: 1,
      to: "0xabc",
      value: 0n
    });
  });
});
