import { describe, expect, it } from "vitest";
import truncateByWords from "./truncateByWords";

describe("truncateByWords", () => {
  it("returns original when short", () => {
    expect(truncateByWords("a b", 5)).toBe("a b");
  });

  it("truncates long text", () => {
    expect(truncateByWords("a b c d", 2)).toBe("a b…");
  });
});
