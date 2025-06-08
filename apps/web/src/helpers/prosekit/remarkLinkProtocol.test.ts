import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { describe, expect, it } from "vitest";
import { remarkLinkProtocol } from "./remarkLinkProtocol";

describe("remarkLinkProtocol", () => {
  it("adds https to bare links", () => {
    const result = unified()
      .use(remarkParse)
      .use(remarkLinkProtocol)
      .use(remarkStringify)
      .processSync("[example.com](example.com)")
      .toString();
    expect(result).toBe("<https://example.com>\n");
  });

  it("keeps links with protocol", () => {
    const result = unified()
      .use(remarkParse)
      .use(remarkLinkProtocol)
      .use(remarkStringify)
      .processSync("[link](http://example.com)")
      .toString();
    expect(result).toBe("[link](http://example.com)\n");
  });

  it("converts bare links with path", () => {
    const result = unified()
      .use(remarkParse)
      .use(remarkLinkProtocol)
      .use(remarkStringify)
      .processSync("[example.com/foo](example.com/foo)")
      .toString();
    expect(result).toBe("<https://example.com/foo>\n");
  });

  it("leaves differing text intact", () => {
    const result = unified()
      .use(remarkParse)
      .use(remarkLinkProtocol)
      .use(remarkStringify)
      .processSync("[click](example.com)")
      .toString();
    expect(result).toBe("[click](example.com)\n");
  });
});
