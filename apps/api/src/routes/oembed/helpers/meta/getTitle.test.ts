import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import getTitle from "./getTitle";

describe("getTitle", () => {
  it("should extract Open Graph title when available", () => {
    const html = '<meta property="og:title" content="Open Graph Title">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe("Open Graph Title");
  });

  it("should extract Twitter title when available", () => {
    const html = '<meta name="twitter:title" content="Twitter Title">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe("Twitter Title");
  });

  it("should prioritize Open Graph title over Twitter title", () => {
    const html = `
      <meta property="og:title" content="Open Graph Title">
      <meta name="twitter:title" content="Twitter Title">
    `;
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe("Open Graph Title");
  });

  it("should return null when no title meta tags found", () => {
    const html = '<meta name="description" content="Some description">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBeNull();
  });

  it("should return null when title meta tags have empty content", () => {
    const html = `
      <meta property="og:title" content="">
      <meta name="twitter:title" content="">
    `;
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBeNull();
  });

  it("should handle whitespace-only titles", () => {
    const html = '<meta property="og:title" content="   ">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe("   ");
  });

  it("should handle special characters in title", () => {
    const html =
      '<meta property="og:title" content="Title &amp; More &quot;Content&quot;">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe('Title & More "Content"');
  });

  it("should handle very long titles", () => {
    const longTitle = "A".repeat(1000);
    const html = `<meta property="og:title" content="${longTitle}">`;
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe(longTitle);
  });

  it("should handle titles with newlines and multiple spaces", () => {
    const html = '<meta property="og:title" content="Title  with\n  spaces">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe("Title  with\n  spaces");
  });

  it("should handle Unicode characters in title", () => {
    const html = '<meta property="og:title" content="🚀 Unicode Title 中文">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe("🚀 Unicode Title 中文");
  });
});
