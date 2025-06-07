import type { Eip712TransactionRequest } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import sponsoredTransactionData from "./sponsoredTransactionData";

describe("sponsoredTransactionData", () => {
  it("converts fields and includes paymaster", () => {
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
    expect(sponsoredTransactionData(raw)).toEqual({
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

  it("omits paymaster fields when missing", () => {
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
    expect(sponsoredTransactionData(raw)).toEqual({
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
