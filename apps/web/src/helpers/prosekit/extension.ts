import { LENS_NAMESPACE } from "@hey/data/constants";
import {
  defineBaseCommands,
  defineBaseKeymap,
  defineHistory,
  defineNodeSpec,
  union
} from "prosekit/core";
import { defineBold } from "prosekit/extensions/bold";
import { defineDoc } from "prosekit/extensions/doc";
import { defineItalic } from "prosekit/extensions/italic";
import { defineLinkMarkRule, defineLinkSpec } from "prosekit/extensions/link";
import type { MentionAttrs } from "prosekit/extensions/mention";
import { defineMentionCommands } from "prosekit/extensions/mention";
import { defineModClickPrevention } from "prosekit/extensions/mod-click-prevention";
import { defineParagraph } from "prosekit/extensions/paragraph";
import { definePlaceholder } from "prosekit/extensions/placeholder";
import { defineText } from "prosekit/extensions/text";
import { defineVirtualSelection } from "prosekit/extensions/virtual-selection";

const defineAutoLink = () => {
  return union([defineLinkSpec(), defineLinkMarkRule()]);
};

const defineMentionSpec = () => {
  return defineNodeSpec({
    atom: true,
    attrs: { id: {}, kind: { default: "" }, value: {} },
    group: "inline",
    inline: true,
    name: "mention",
    parseDOM: [
      {
        getAttrs: (dom): MentionAttrs => {
          const el = dom as HTMLElement;
          const id = el.getAttribute("data-id") || "";
          const kind = el.getAttribute("data-mention") || "";
          const value = el.textContent?.replace(/^@(?:lens\/)?/g, "") || "";
          return { id, kind, value };
        },
        tag: "span[data-mention]"
      }
    ],
    toDOM(node) {
      const attrs = node.attrs as MentionAttrs;
      const value = attrs.value.toString();

      const children =
        attrs.kind === "account"
          ? [
              ["span", "@"],
              ["span", { class: "hidden" }, LENS_NAMESPACE],
              ["span", value]
            ]
          : [["span", value]];

      return [
        "span",
        {
          "data-id": attrs.id.toString(),
          "data-mention": attrs.kind.toString()
        },
        ...children
      ];
    }
  });
};

const defineMention = () => {
  return union([defineMentionSpec(), defineMentionCommands()]);
};

export const defineEditorExtension = () => {
  return union([
    defineDoc(),
    defineText(),
    defineParagraph(),
    defineHistory(),
    defineBaseKeymap(),
    defineBaseCommands(),
    defineItalic(),
    defineBold(),
    defineAutoLink(),
    defineVirtualSelection(),
    defineMention(),
    defineModClickPrevention(),
    definePlaceholder({ placeholder: "What's new?!", strategy: "doc" })
  ]);
};

export type EditorExtension = ReturnType<typeof defineEditorExtension>;
