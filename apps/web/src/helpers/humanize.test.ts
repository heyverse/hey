import { describe, expect, it } from "vitest";
import humanize from "./humanize";

describe("humanize", () => {
  it("formats finite numbers", () => {
    expect(humanize(1234)).toBe("1,234");
  });

  it("returns empty string for invalid", () => {
    expect(humanize(Number.POSITIVE_INFINITY)).toBe("");
  });
});
