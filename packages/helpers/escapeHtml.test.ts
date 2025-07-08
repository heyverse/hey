import { describe, expect, it } from "vitest";
import escapeHtml from "./escapeHtml";

describe("escapeHtml", () => {
  it("escapes HTML characters in user-generated social media content", () => {
    const result = escapeHtml(`<div>&'"</div>`);
    expect(result).toBe("&lt;div&gt;&amp;&#39;&quot;&lt;/div&gt;");
  });

  it("returns empty string when post content is missing", () => {
    expect(escapeHtml()).toBe("");
    expect(escapeHtml(null)).toBe("");
  });

  it("leaves normal social media posts unchanged", () => {
    const text = "GM frens! Hope everyone is having a great day in Web3 🚀";
    expect(escapeHtml(text)).toBe(text);
  });
});
