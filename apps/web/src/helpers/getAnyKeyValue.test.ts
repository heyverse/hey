import { describe, expect, it } from "vitest";
import getAnyKeyValue from "./getAnyKeyValue";

describe("getAnyKeyValue", () => {
  const data = [
    { __typename: "AddressKeyValue", key: "addr", address: "0x1" },
    { __typename: "BigDecimalKeyValue", key: "amount", bigDecimal: "1.5" },
    { __typename: "StringKeyValue", key: "name", string: "alice" }
  ] as any;

  it("returns null when key not found", () => {
    expect(getAnyKeyValue(data, "missing")).toBeNull();
  });

  it("returns address value", () => {
    expect(getAnyKeyValue(data, "addr")).toEqual({ address: "0x1" });
  });

  it("returns bigDecimal value", () => {
    expect(getAnyKeyValue(data, "amount")).toEqual({ bigDecimal: "1.5" });
  });

  it("returns string value", () => {
    expect(getAnyKeyValue(data, "name")).toEqual({ string: "alice" });
  });
});
