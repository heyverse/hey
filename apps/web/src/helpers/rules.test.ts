import type { AccountFollowRules, GroupRules } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import { getSimplePaymentDetails } from "./rules";

const paymentConfig = () => [
  { __typename: "BigDecimalKeyValue", bigDecimal: "2", key: "amount" } as any,
  {
    __typename: "AddressKeyValue",
    address: "0xToken",
    key: "assetContract"
  } as any,
  { __typename: "StringKeyValue", key: "assetSymbol", string: "SOC" } as any
];

describe("getSimplePaymentDetails", () => {
  it("extracts membership fee from group rules", () => {
    const rules = {
      anyOf: [],
      required: [{ config: paymentConfig(), type: "SIMPLE_PAYMENT" }]
    } as unknown as GroupRules;

    const result = getSimplePaymentDetails(rules);
    expect(result).toEqual({
      amount: 2,
      assetAddress: "0xToken",
      assetSymbol: "SOC"
    });
  });

  it("reads follow fee from optional rules when required missing", () => {
    const rules = {
      anyOf: [{ config: paymentConfig(), type: "SIMPLE_PAYMENT" }],
      required: [{ config: [], type: "TOKEN_GATED" }]
    } as unknown as AccountFollowRules;

    const result = getSimplePaymentDetails(rules);
    expect(result).toEqual({
      amount: null,
      assetAddress: null,
      assetSymbol: null
    });
  });

  it("returns null values when simple payment is absent", () => {
    const rules = { anyOf: [], required: [] } as unknown as GroupRules;

    const result = getSimplePaymentDetails(rules);
    expect(result).toEqual({
      amount: null,
      assetAddress: null,
      assetSymbol: null
    });
  });
});
