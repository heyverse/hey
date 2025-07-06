import { createEditor } from "prosekit/core";
import { describe, expect, it } from "vitest";
import { defineEditorExtension } from "./extension";

describe("defineEditorExtension", () => {
  it("registers mention node and link mark", () => {
    const extension = defineEditorExtension();
    const mount = document.createElement("div");
    const editor = createEditor({ extension });
    editor.mount(mount);
    const { schema } = editor.view.state;
    expect(schema.nodes.mention).toBeDefined();
    expect(schema.marks.link).toBeDefined();
  });
});
