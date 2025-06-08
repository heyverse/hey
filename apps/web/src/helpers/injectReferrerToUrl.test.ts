import { describe, expect, it } from "vitest";
import injectReferrerToUrl from "./injectReferrerToUrl";

const BASE = "https://example.com";

describe("injectReferrerToUrl", () => {
  it("returns original for invalid url", () => {
    expect(injectReferrerToUrl("not a url")).toBe("not a url");
  });

  it("adds referrer param for supported domain", () => {
    const url = injectReferrerToUrl("https://zora.co/collect");
    expect(url).toContain("referrer=");
  });

  it("appends referrer when query params exist", () => {
    const url = injectReferrerToUrl("https://zora.co/collect?foo=bar");
    const parsed = new URL(url);
    expect(parsed.searchParams.get("foo")).toBe("bar");
    expect(parsed.searchParams.get("referrer")).not.toBeNull();
  });

  it("adds referrer for highlight.xyz", () => {
    const url = injectReferrerToUrl("https://highlight.xyz/mint");
    expect(url).toContain("referrer=");
  });

  it("leaves other domains unchanged", () => {
    const url = `${BASE}/path`;
    expect(injectReferrerToUrl(url)).toBe(url);
  });
});
