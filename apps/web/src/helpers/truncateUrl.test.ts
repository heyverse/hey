import { describe, expect, it } from "vitest";
import truncateUrl from "./truncateUrl";

describe("truncateUrl", () => {
  it("formats external urls", () => {
    const url = "https://www.social.com/post/123?utm=abc#top";
    const result = truncateUrl(url, 50);
    expect(result).toBe("social.com/post/123?utm=abc#top");
  });

  it("does not truncate hey.xyz links", () => {
    const url = "https://blog.hey.xyz/discover/new";
    const result = truncateUrl(url, 10);
    expect(result).toBe("blog.hey.xyz/discover/new");
  });

  it("truncates long urls", () => {
    const url = "https://example.com/some/very/long/path";
    const result = truncateUrl(url, 15);
    expect(result).toBe("example.com/so…");
  });

  it("handles invalid urls", () => {
    const result = truncateUrl("invalid url", 10);
    expect(result).toBe("invalid u…");
  });
});
