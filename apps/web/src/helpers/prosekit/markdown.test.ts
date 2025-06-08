import { describe, expect, it } from "vitest";
import { htmlFromMarkdown, markdownFromHTML } from "./markdown";

describe("markdown", () => {
  it("converts html to markdown", () => {
    expect(markdownFromHTML("<p>Hello</p>")).toBe("Hello\n");
  });

  it("converts markdown to html", () => {
    expect(htmlFromMarkdown("Hello")).toBe("<p>Hello</p>\n");
  });

  it("joins consecutive paragraphs", () => {
    expect(markdownFromHTML("<p>A</p><p>B</p>")).toBe("A\nB\n");
  });

  it("keeps underscores unescaped", () => {
    expect(markdownFromHTML("<p>hello_world</p>")).toBe("hello_world\n");
  });

  it("converts lists", () => {
    const html = "<ul><li>A</li><li>B</li></ul>";
    expect(markdownFromHTML(html)).toBe("* A\n* B\n");
    expect(htmlFromMarkdown("* A\n* B")).toBe(
      "<ul>\n<li>A</li>\n<li>B</li>\n</ul>\n"
    );
  });

  it("handles rich text", () => {
    const html = "<p><strong>@user_name</strong> #tag</p>";
    expect(markdownFromHTML(html)).toBe("**@user_name** #tag\n");
    expect(htmlFromMarkdown("**bold** _italic_")).toBe(
      "<p><strong>bold</strong> <em>italic</em></p>\n"
    );
  });
});
