import type { Element, Node, Parent, Root } from "hast";

import type { Plugin } from "unified";
import { visitParents } from "unist-util-visit-parents";

function isParent(node: Node): node is Parent {
  return "children" in node && Array.isArray(node.children);
}

interface Paragraph extends Element {
  tagName: "p";
}

function isElement(node: Node): node is Element {
  return node.type === "element";
}

function isParagraph(node: Node): node is Paragraph {
  return isElement(node) && node.tagName.toLowerCase() === "p";
}

function isParagraphEmpty(node: Paragraph): boolean {
  return node.children.length === 0;
}

function joinParagraphs(a: Paragraph, b: Paragraph): Paragraph {
  const br: Element = {
    type: "element",
    tagName: "br",
    properties: {},
    children: []
  };

  return {
    ...a,
    ...b,
    properties: { ...a.properties, ...b.properties },
    children: [...a.children, br, ...b.children]
  };
}

function joinChildren<T extends Node>(children: T[]): T[] {
  const result: T[] = [];

  for (const child of children) {
    const previous = result.at(-1);
    if (
      previous &&
      isParagraph(previous) &&
      isParagraph(child) &&
      !isParagraphEmpty(previous) &&
      !isParagraphEmpty(child)
    ) {
      result[result.length - 1] = joinParagraphs(previous, child) as Node as T;
    } else {
      result.push(child);
    }
  }

  return result;
}

const rehypeJoinParagraphTransformer = (root: Root): Root => {
  visitParents(root, (node) => {
    if (isParent(node)) {
      node.children = joinChildren(node.children);
    }
  });

  return root;
};

/**
 * A rehype (HTML) plugin that joins adjacent non-empty <p> elements into a
 * single <p> element with a <br> element between them.
 */
export const rehypeJoinParagraph: Plugin<[], Root> = () =>
  rehypeJoinParagraphTransformer;
