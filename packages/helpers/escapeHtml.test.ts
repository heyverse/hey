import { describe, expect, it } from "vitest";
import escapeHtml from "./escapeHtml";

describe("escapeHtml", () => {
  it("escapes HTML characters", () => {
    const result = escapeHtml(`<div>&'"</div>`);
    expect(result).toBe("&lt;div&gt;&amp;&#39;&quot;&lt;/div&gt;");
  });

  it("returns an empty string for null or undefined", () => {
    expect(escapeHtml()).toBe("");
    expect(escapeHtml(null)).toBe("");
  });

  it("returns the same string when no special characters are present", () => {
    const text = "Hello World";
    expect(escapeHtml(text)).toBe(text);
  });
});
