import { describe, expect, it } from "vitest";
import { getSimplePaymentDetails } from "./rules";

describe("getSimplePaymentDetails", () => {
  const rule = {
    type: "SIMPLE_PAYMENT",
    config: [
      { __typename: "AddressKeyValue", key: "assetContract", address: "0x1" },
      { __typename: "StringKeyValue", key: "assetSymbol", string: "USD" },
      { __typename: "BigDecimalKeyValue", key: "amount", bigDecimal: "5" }
    ]
  } as any;

  it("extracts payment details", () => {
    const rules = { required: [rule], anyOf: [] } as any;
    expect(getSimplePaymentDetails(rules)).toEqual({
      assetAddress: "0x1",
      assetSymbol: "USD",
      amount: 5
    });
  });

  it("returns null fields when not found", () => {
    const rules = { required: [], anyOf: [] } as any;
    expect(getSimplePaymentDetails(rules)).toEqual({
      assetAddress: null,
      assetSymbol: null,
      amount: null
    });
  });
});
