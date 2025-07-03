import { describe, expect, it } from "vitest";
import getTransactionData from "./getTransactionData";

const baseTx = {
  data: "0x00",
  gasLimit: 21000,
  maxFeePerGas: 100n,
  maxPriorityFeePerGas: 2n,
  nonce: 1,
  to: "0xabc" as any,
  value: 0n
} as any;

describe("getTransactionData", () => {
  it("returns basic transaction data", () => {
    const result = getTransactionData(baseTx);
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

  it("includes paymaster data when sponsored", () => {
    const sponsoredTx = {
      ...baseTx,
      customData: {
        paymasterParams: {
          paymaster: "0xdef",
          paymasterInput: "0x123"
        }
      }
    } as any;
    const result = getTransactionData(sponsoredTx, { sponsored: true });
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
});
