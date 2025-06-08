import { describe, expect, it, vi } from "vitest";

vi.mock("prosekit/core", () => ({
  htmlFromNode: vi.fn(() => "<p>html</p>"),
  nodeFromHTML: vi.fn(() => ({ content: "node" }))
}));
vi.mock("prosekit/extensions/list", () => ({ ListDOMSerializer: {} }));

import { htmlFromNode, nodeFromHTML } from "prosekit/core";
import * as markdown from "./markdown";
import { getMarkdownContent, setMarkdownContent } from "./markdownContent";

describe("markdownContent", () => {
  it("returns empty string when not mounted", () => {
    expect(getMarkdownContent({ mounted: false } as any)).toBe("");
  });

  it("retrieves markdown from editor", () => {
    const state = { doc: {} } as any;
    const editor = { mounted: true, view: { state } } as any;
    const result = getMarkdownContent(editor);
    expect(htmlFromNode).toHaveBeenCalledWith(state.doc, { DOMSerializer: {} });
    expect(result).toBe(markdown.markdownFromHTML("<p>html</p>"));
  });

  it("sets markdown content", () => {
    const replaceWith = vi.fn(() => "tr" as any);
    const state = {
      doc: { content: { size: 1 } },
      schema: {},
      tr: { replaceWith }
    } as any;
    const dispatch = vi.fn();
    const editor = { mounted: true, view: { state, dispatch } } as any;
    const spy = vi.spyOn(markdown, "htmlFromMarkdown");
    setMarkdownContent(editor, "md");
    expect(spy).toHaveBeenCalledWith("md");
    expect(nodeFromHTML).toHaveBeenCalledWith(markdown.htmlFromMarkdown("md"), {
      schema: state.schema
    });
    expect(replaceWith).toHaveBeenCalledWith(0, state.doc.content.size, "node");
    expect(dispatch).toHaveBeenCalledWith("tr");
  });

  it("does nothing when not mounted", () => {
    const spy = vi.spyOn(markdown, "htmlFromMarkdown");
    const editor = { mounted: false } as any;
    setMarkdownContent(editor, "md");
    expect(spy).not.toHaveBeenCalled();
  });
});
