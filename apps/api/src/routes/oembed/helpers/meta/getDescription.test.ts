import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import getDescription from "./getDescription";

describe("getDescription", () => {
  it("should extract Open Graph description when available", () => {
    const html =
      '<meta property="og:description" content="Open Graph Description">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe("Open Graph Description");
  });

  it("should extract Twitter description when available", () => {
    const html =
      '<meta name="twitter:description" content="Twitter Description">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe("Twitter Description");
  });

  it("should prioritize Open Graph description over Twitter description", () => {
    const html = `
      <meta property="og:description" content="Open Graph Description">
      <meta name="twitter:description" content="Twitter Description">
    `;
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe("Open Graph Description");
  });

  it("should return null when no description meta tags found", () => {
    const html = '<meta name="title" content="Some title">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBeNull();
  });

  it("should return null when description meta tags have empty content", () => {
    const html = `
      <meta property="og:description" content="">
      <meta name="twitter:description" content="">
    `;
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBeNull();
  });

  it("should handle whitespace-only descriptions", () => {
    const html = '<meta property="og:description" content="   ">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe("   ");
  });

  it("should handle special characters in description", () => {
    const html =
      '<meta property="og:description" content="Description &amp; More &quot;Content&quot;">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe('Description & More "Content"');
  });

  it("should handle very long descriptions", () => {
    const longDescription = "A".repeat(2000);
    const html = `<meta property="og:description" content="${longDescription}">`;
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe(longDescription);
  });

  it("should handle descriptions with newlines and multiple spaces", () => {
    const html =
      '<meta property="og:description" content="Description  with\n  spaces">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe("Description  with\n  spaces");
  });

  it("should handle Unicode characters in description", () => {
    const html =
      '<meta property="og:description" content="🚀 Unicode Description 中文">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe("🚀 Unicode Description 中文");
  });

  it("should handle HTML entities in description", () => {
    const html =
      '<meta property="og:description" content="&lt;script&gt; alert(&quot;test&quot;) &lt;/script&gt;">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe('<script> alert("test") </script>');
  });
});
