import { describe, expect, it } from "vitest";
import getCollectActionData from "./getCollectActionData";

describe("getCollectActionData", () => {
  it("returns null for unknown type", () => {
    expect(getCollectActionData({ __typename: "Other" } as any)).toBeNull();
  });

  it("parses simple collect action", () => {
    const action = {
      __typename: "SimpleCollectAction",
      collectLimit: 10,
      endsAt: "date",
      payToCollect: {
        price: {
          value: "1",
          asset: { contract: { address: "0x1" }, symbol: "AAA" }
        },
        recipients: []
      }
    } as any;
    expect(getCollectActionData(action)).toEqual({
      price: 1,
      assetAddress: "0x1",
      assetSymbol: "AAA",
      collectLimit: 10,
      endsAt: "date",
      recipients: []
    });
  });
});
