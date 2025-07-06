import { describe, expect, it } from "vitest";
import { htmlFromMarkdown, markdownFromHTML } from "./markdown";

const joinHtml = "<p>Hello</p><p>World</p>";

describe("markdown and html conversion", () => {
  it("converts html to markdown without escaping underscores", () => {
    const result = markdownFromHTML("<p>hey_world</p>");
    expect(result).toBe("hey_world\n");
  });

  it("joins consecutive paragraphs when converting to markdown", () => {
    const result = markdownFromHTML(joinHtml);
    expect(result).toBe("Hello\nWorld\n");
  });

  it("round trips markdown to html", () => {
    const markdown = "Hello\nWorld";
    const html = htmlFromMarkdown(markdown);
    expect(html).toBe("<p>Hello\nWorld</p>\n");
  });
});
