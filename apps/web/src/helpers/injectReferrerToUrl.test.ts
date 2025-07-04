import { HEY_TREASURY } from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import injectReferrerToUrl from "./injectReferrerToUrl";

describe("injectReferrerToUrl", () => {
  it("returns the input when url is invalid", () => {
    const input = "not a url";
    expect(injectReferrerToUrl(input)).toBe(input);
  });

  it("adds referrer param for highlight links", () => {
    const url = injectReferrerToUrl("https://highlight.xyz/mint/1");
    const parsed = new URL(url);
    expect(parsed.hostname).toBe("highlight.xyz");
    expect(parsed.searchParams.get("referrer")).toBe(HEY_TREASURY);
  });

  it("supports subdomains", () => {
    const url = injectReferrerToUrl("https://app.highlight.xyz/auction");
    const parsed = new URL(url);
    expect(parsed.searchParams.get("referrer")).toBe(HEY_TREASURY);
  });

  it("appends the param when query exists", () => {
    const url = injectReferrerToUrl("https://zora.co/collect?foo=bar");
    const parsed = new URL(url);
    expect(parsed.searchParams.get("foo")).toBe("bar");
    expect(parsed.searchParams.get("referrer")).toBe(HEY_TREASURY);
  });

  it("returns the same url for other domains", () => {
    const original = "https://example.com/post?id=1";
    expect(injectReferrerToUrl(original)).toBe(original);
  });
});
