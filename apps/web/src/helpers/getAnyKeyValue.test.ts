import { describe, expect, it } from "vitest";
import getAnyKeyValue from "./getAnyKeyValue";

const addressKeyValue = {
  __typename: "AddressKeyValue",
  address: "0x1234",
  key: "owner"
} as any;

const bigDecimalKeyValue = {
  __typename: "BigDecimalKeyValue",
  bigDecimal: "1000",
  key: "followers"
} as any;

const stringKeyValue = {
  __typename: "StringKeyValue",
  key: "bio",
  string: "Hello there"
} as any;

const unknownKeyValue = {
  __typename: "RandomKeyValue",
  key: "location",
  value: "Earth"
} as any;

describe("getAnyKeyValue", () => {
  it("returns address value when key matches", () => {
    const result = getAnyKeyValue([addressKeyValue], "owner");
    expect(result).toEqual({ address: "0x1234" });
  });

  it("returns bigDecimal value when key matches", () => {
    const result = getAnyKeyValue([bigDecimalKeyValue], "followers");
    expect(result).toEqual({ bigDecimal: "1000" });
  });

  it("returns string value when key matches", () => {
    const result = getAnyKeyValue([stringKeyValue], "bio");
    expect(result).toEqual({ string: "Hello there" });
  });

  it("returns null when key is missing", () => {
    const result = getAnyKeyValue([addressKeyValue], "missing");
    expect(result).toBeNull();
  });

  it("returns null for unsupported key value type", () => {
    const result = getAnyKeyValue([unknownKeyValue], "location");
    expect(result).toBeNull();
  });
});
