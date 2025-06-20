import { describe, expect, it } from "vitest";
import getDbPostId from "./getDbPostId";

describe("getDbPostId", () => {
  it("converts decimal string to hex", () => {
    expect(getDbPostId("123")).toBe("\\x7b");
  });

  it("returns empty string for empty input", () => {
    expect(getDbPostId("")).toBe("");
  });

  it("throws error for invalid decimal", () => {
    expect(() => getDbPostId("abc")).toThrowError();
  });
});
