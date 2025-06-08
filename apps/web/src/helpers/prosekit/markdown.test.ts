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
});
