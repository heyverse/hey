import rehypeParse from "rehype-parse";
import { unified } from "unified";
import { describe, expect, it } from "vitest";
import { rehypeJoinParagraph } from "./rehypeJoinParagraph";

describe("rehypeJoinParagraph", () => {
  it("joins adjacent paragraphs", () => {
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeJoinParagraph);
    const root = processor.parse("<p>A</p><p>B</p>");
    const result = processor.runSync(root) as any;
    expect(result.children).toHaveLength(1);
    const p = result.children[0] as any;
    expect(p.tagName).toBe("p");
    expect(p.children[1].tagName).toBe("br");
  });

  it("ignores empty paragraphs", () => {
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeJoinParagraph);
    const root = processor.parse("<p>A</p><p></p><p>B</p>");
    const result = processor.runSync(root) as any;
    expect(result.children).toHaveLength(3);
  });

  it("joins paragraphs inside container", () => {
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeJoinParagraph);
    const root = processor.parse("<div><p>A</p><p>B</p></div>");
    const result = processor.runSync(root) as any;
    const div = result.children[0] as any;
    expect(div.children).toHaveLength(1);
    expect(div.children[0].children[1].tagName).toBe("br");
  });
});
