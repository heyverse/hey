import { describe, expect, it } from "vitest";
import getFavicon from "./getFavicon";

describe("getFavicon", () => {
  it("generates favicon URL for social media domain", () => {
    const result = getFavicon("https://twitter.com/lens");
    expect(result).toBe(
      "https://external-content.duckduckgo.com/ip3/twitter.com.ico"
    );
  });

  it("handles subdomains correctly", () => {
    const result = getFavicon("https://m.facebook.com/user");
    expect(result).toBe(
      "https://external-content.duckduckgo.com/ip3/m.facebook.com.ico"
    );
  });

  it("falls back to unknown domain on invalid URL", () => {
    const result = getFavicon("not a url");
    expect(result).toBe(
      "https://external-content.duckduckgo.com/ip3/unknowndomain.ico"
    );
  });
});
