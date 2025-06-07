import { describe, expect, it } from "vitest";
import escapeHtml from "./escapeHtml";

describe("escapeHtml", () => {
  it("escapes angle brackets", () => {
    expect(escapeHtml("<tag>")).toBe("&lt;tag&gt;");
  });

  it("escapes quotes and ampersands", () => {
    expect(escapeHtml('"Tom & Jerry"')).toBe("&quot;Tom &amp; Jerry&quot;");
  });

  it("handles null or undefined", () => {
    expect(escapeHtml(undefined)).toBe("");
    expect(escapeHtml(null)).toBe("");
  });
});
