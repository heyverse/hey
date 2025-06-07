import { describe, expect, it } from "vitest";
import truncateUrl from "./truncateUrl";

describe("truncateUrl", () => {
  it("returns stripped url for hey domain", () => {
    expect(truncateUrl("https://www.hey.xyz/test", 10)).toBe("hey.xyz/test");
  });

  it("truncates long url", () => {
    expect(truncateUrl("https://example.com/longpath", 10)).toBe("example.c…");
  });

  it("falls back for invalid url", () => {
    expect(truncateUrl("not a url", 5)).toBe("not …");
  });
});
