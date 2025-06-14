import type { Eip712TransactionRequest } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import getTransactionData from "./getTransactionData";

describe("getTransactionData", () => {
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

    expect(getTransactionData(raw)).toEqual({
      data: "0x",
      gas: 1n,
      maxFeePerGas: 2n,
      maxPriorityFeePerGas: 3n,
      nonce: 4,
      to: "0x1",
      value: 5n
    });
  });

  it("ignores paymaster params by default", () => {
    const raw = {
      data: "0x",
      gasLimit: 1,
      maxFeePerGas: 2,
      maxPriorityFeePerGas: 3,
      nonce: 4,
      to: "0x1",
      value: 5,
      customData: { paymasterParams: { paymaster: "p", paymasterInput: "i" } }
    } as any;

    expect(getTransactionData(raw)).toEqual({
      data: "0x",
      gas: 1n,
      maxFeePerGas: 2n,
      maxPriorityFeePerGas: 3n,
      nonce: 4,
      to: "0x1",
      value: 5n
    });
  });

  it("includes paymaster params when sponsored", () => {
    const raw = {
      data: "0x",
      gasLimit: 1,
      maxFeePerGas: 2,
      maxPriorityFeePerGas: 3,
      nonce: 4,
      to: "0x1",
      value: 5,
      customData: {
        paymasterParams: { paymaster: "p", paymasterInput: "i" }
      }
    } as any;

    expect(getTransactionData(raw, { sponsored: true })).toEqual({
      data: "0x",
      gas: 1n,
      maxFeePerGas: 2n,
      maxPriorityFeePerGas: 3n,
      nonce: 4,
      paymaster: "p",
      paymasterInput: "i",
      to: "0x1",
      value: 5n
    });
  });

  it("handles missing paymasterInput", () => {
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

    expect(getTransactionData(raw, { sponsored: true })).toEqual({
      data: "0x",
      gas: 1n,
      maxFeePerGas: 2n,
      maxPriorityFeePerGas: 3n,
      nonce: 4,
      paymaster: "p",
      paymasterInput: undefined,
      to: "0x1",
      value: 5n
    });
  });

  it("handles missing paymaster params", () => {
    const raw = {
      data: "0x",
      gasLimit: 1,
      maxFeePerGas: 2,
      maxPriorityFeePerGas: 3,
      nonce: 4,
      to: "0x1",
      value: 5,
      customData: {}
    } as unknown as Eip712TransactionRequest;

    expect(getTransactionData(raw, { sponsored: true })).toEqual({
      data: "0x",
      gas: 1n,
      maxFeePerGas: 2n,
      maxPriorityFeePerGas: 3n,
      nonce: 4,
      paymaster: undefined,
      paymasterInput: undefined,
      to: "0x1",
      value: 5n
    });
  });
});
