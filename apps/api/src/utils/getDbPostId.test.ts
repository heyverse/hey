import { describe, expect, it } from "vitest";
import getDbPostId from "./getDbPostId";

describe("getDbPostId", () => {
  it("converts decimal string to hex with prefix", () => {
    const result = getDbPostId("1234567890");
    expect(result).toBe("\\x499602d2");
  });

  it("returns empty string when input is empty", () => {
    expect(getDbPostId("")).toBe("");
  });

  it("throws error for non digit strings", () => {
    expect(() => getDbPostId("abc123")).toThrow("Invalid decimal value");
  });

  it("throws error for negative numbers", () => {
    expect(() => getDbPostId("-1")).toThrow("Invalid decimal value");
  });

  it("handles large numbers", () => {
    const large = "18446744073709551615";
    expect(getDbPostId(large)).toBe("\\xffffffffffffffff");
  });
});
