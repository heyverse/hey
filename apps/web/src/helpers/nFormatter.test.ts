import { describe, expect, it } from "vitest";
import nFormatter from "./nFormatter";

// Tests for nFormatter used in social media contexts

describe("nFormatter", () => {
  it("formats small follower counts", () => {
    expect(nFormatter(847)).toBe("847");
  });

  it("abbreviates thousands with a k", () => {
    expect(nFormatter(1520)).toBe("1.5k");
  });

  it("abbreviates millions with an M", () => {
    expect(nFormatter(2300000)).toBe("2.3M");
  });

  it("returns empty string for invalid counts", () => {
    expect(nFormatter(Number.POSITIVE_INFINITY)).toBe("");
    expect(nFormatter(Number.NaN)).toBe("");
  });
});
