import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import getMetaContent from "./getMetaContent";

describe("getMetaContent", () => {
  it("should extract meta content by name attribute", () => {
    const html = '<meta name="description" content="Test description">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe("Test description");
  });

  it("should extract meta content by property attribute", () => {
    const html = '<meta property="og:title" content="Test title">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "og:title");
    expect(result).toBe("Test title");
  });

  it("should return null when meta tag not found", () => {
    const html = '<meta name="keywords" content="test">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBeNull();
  });

  it("should return null when meta tag has no content", () => {
    const html = '<meta name="description">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBeNull();
  });

  it("should return empty string when meta tag has empty content", () => {
    const html = '<meta name="description" content="">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe("");
  });

  it("should handle case-sensitive attribute matching", () => {
    const html = '<meta NAME="description" content="Test description">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBeNull();
  });

  it("should prefer name attribute over property when both exist", () => {
    const html = `
      <meta name="description" content="Name description">
      <meta property="description" content="Property description">
    `;
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe("Name description");
  });

  it("should handle multiple meta tags with same name", () => {
    const html = `
      <meta name="description" content="First description">
      <meta name="description" content="Second description">
    `;
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe("First description");
  });

  it("should handle special characters in content", () => {
    const html =
      '<meta name="description" content="Test &amp; special &quot;chars&quot;">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe('Test & special "chars"');
  });

  it("should return whitespace-only content as-is", () => {
    const html = '<meta name="description" content="   ">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe("   ");
  });
});
