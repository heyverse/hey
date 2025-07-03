import type { SimpleCollectActionFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import getCollectActionData from "./getCollectActionData";

describe("getCollectActionData", () => {
  it("returns null for non-simple collect actions", () => {
    const action = {
      __typename: "Unknown"
    } as unknown as SimpleCollectActionFragment;
    const result = getCollectActionData(action);
    expect(result).toBeNull();
  });

  it("extracts data from a collect action", () => {
    const action: SimpleCollectActionFragment = {
      __typename: "SimpleCollectAction",
      address: "0x1",
      collectLimit: 10,
      endsAt: "2025-01-01",
      payToCollect: {
        __typename: "PayToCollectConfig",
        price: {
          __typename: "Erc20Amount",
          asset: {
            __typename: "Erc20",
            contract: { __typename: "NetworkAddress", address: "0xasset" },
            decimals: 18,
            name: "Token",
            symbol: "TKN"
          },
          value: "1.5"
        },
        recipients: [
          { __typename: "RecipientPercent", address: "0xabc", percent: 80 },
          { __typename: "RecipientPercent", address: "0xdef", percent: 20 }
        ],
        referralShare: null
      }
    };

    const result = getCollectActionData(action);
    expect(result).toEqual({
      assetAddress: "0xasset",
      assetSymbol: "TKN",
      collectLimit: 10,
      endsAt: "2025-01-01",
      price: 1.5,
      recipients: [
        { __typename: "RecipientPercent", address: "0xabc", percent: 80 },
        { __typename: "RecipientPercent", address: "0xdef", percent: 20 }
      ]
    });
  });

  it("handles actions without payment configuration", () => {
    const action: SimpleCollectActionFragment = {
      __typename: "SimpleCollectAction",
      address: "0x2",
      collectLimit: undefined,
      endsAt: undefined,
      payToCollect: null
    };
    const result = getCollectActionData(action);
    expect(result).toEqual({
      assetAddress: undefined,
      assetSymbol: undefined,
      collectLimit: Number.NaN,
      endsAt: undefined,
      price: 0,
      recipients: []
    });
  });
});
