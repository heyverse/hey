import { describe, expect, it } from "vitest";
import getFavicon from "./getFavicon";

const BASE = "https://external-content.duckduckgo.com/ip3";

describe("getFavicon", () => {
  it("returns favicon for valid url", () => {
    expect(getFavicon("https://hey.xyz")).toBe(`${BASE}/hey.xyz.ico`);
  });

  it("handles invalid url", () => {
    expect(getFavicon("not a url")).toBe(`${BASE}/unknowndomain.ico`);
  });

  it("handles empty input", () => {
    expect(getFavicon("")).toBe(`${BASE}/unknowndomain.ico`);
  });
});
