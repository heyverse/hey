import { describe, expect, it } from "vitest";
import selfFundedTransactionData from "./selfFundedTransactionData";

describe("selfFundedTransactionData", () => {
  it("converts fields to bigint", () => {
    const raw = {
      data: "0x",
      gasLimit: 1,
      maxFeePerGas: 2,
      maxPriorityFeePerGas: 3,
      nonce: 4,
      to: "0x1",
      value: 5
    } as any;
    expect(selfFundedTransactionData(raw)).toEqual({
      data: "0x",
      gas: 1n,
      maxFeePerGas: 2n,
      maxPriorityFeePerGas: 3n,
      nonce: 4,
      to: "0x1",
      value: 5n
    });
  });

  it("ignores null paymaster params", () => {
    const raw = {
      data: "0x",
      gasLimit: 1,
      maxFeePerGas: 2,
      maxPriorityFeePerGas: 3,
      nonce: 4,
      to: "0x1",
      value: 5,
      customData: { paymasterParams: null }
    } as any;
    expect(selfFundedTransactionData(raw)).toEqual({
      data: "0x",
      gas: 1n,
      maxFeePerGas: 2n,
      maxPriorityFeePerGas: 3n,
      nonce: 4,
      to: "0x1",
      value: 5n
    });
  });

  it("ignores missing paymasterInput", () => {
    const raw = {
      data: "0x",
      gasLimit: 1,
      maxFeePerGas: 2,
      maxPriorityFeePerGas: 3,
      nonce: 4,
      to: "0x1",
      value: 5,
      customData: { paymasterParams: { paymaster: "p" } }
    } as any;
    expect(selfFundedTransactionData(raw)).toEqual({
      data: "0x",
      gas: 1n,
      maxFeePerGas: 2n,
      maxPriorityFeePerGas: 3n,
      nonce: 4,
      to: "0x1",
      value: 5n
    });
  });
});
