import { describe, expect, it } from "vitest";
import escapeHtml from "./escapeHtml";

describe("escapeHtml", () => {
  it("escapes HTML characters", () => {
    const result = escapeHtml(`<div>&'"</div>`);
    expect(result).toBe("&lt;div&gt;&amp;&#39;&quot;&lt;/div&gt;");
  });
});
