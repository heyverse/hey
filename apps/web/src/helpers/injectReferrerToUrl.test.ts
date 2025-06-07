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

  it("leaves other domains unchanged", () => {
    const url = `${BASE}/path`;
    expect(injectReferrerToUrl(url)).toBe(url);
  });
});
