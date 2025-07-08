import { describe, expect, it } from "vitest";
import humanize from "./humanize";

describe("humanize", () => {
  it("formats large follower counts with commas", () => {
    expect(humanize(1234567)).toBe("1,234,567");
    expect(humanize(987654321)).toBe("987,654,321");
  });

  it("handles zero followers and negative reputation scores", () => {
    expect(humanize(0)).toBe("0");
    expect(humanize(-9876)).toBe("-9,876");
  });

  it("returns empty string for invalid social media metrics", () => {
    expect(humanize(Number.NaN)).toBe("");
    expect(humanize(Number.POSITIVE_INFINITY)).toBe("");
  });
});
