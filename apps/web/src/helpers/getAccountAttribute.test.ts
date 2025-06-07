import { describe, expect, it } from "vitest";
import getAccountAttribute from "./getAccountAttribute";

describe("getAccountAttribute", () => {
  const attrs = [
    { key: "location", value: "mars" },
    { key: "website", value: "https://hey.xyz" }
  ] as any;

  it("returns empty string when not found", () => {
    expect(getAccountAttribute("x", attrs)).toBe("");
  });

  it("finds value by key", () => {
    expect(getAccountAttribute("location", attrs)).toBe("mars");
  });
});
