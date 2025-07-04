import { describe, expect, it } from "vitest";
import humanize from "./humanize";

describe("humanize", () => {
  it("formats large numbers with commas", () => {
    expect(humanize(1234567)).toBe("1,234,567");
    expect(humanize(987654321)).toBe("987,654,321");
  });

  it("handles zero and negatives", () => {
    expect(humanize(0)).toBe("0");
    expect(humanize(-9876)).toBe("-9,876");
  });

  it("returns empty string for invalid numbers", () => {
    expect(humanize(Number.NaN)).toBe("");
    expect(humanize(Number.POSITIVE_INFINITY)).toBe("");
  });
});
