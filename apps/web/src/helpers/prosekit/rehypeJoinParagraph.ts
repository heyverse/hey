import type { Element, Node, Parent, Root } from "hast";

import type { Plugin } from "unified";
import { visitParents } from "unist-util-visit-parents";

const isParent = (node: Node): node is Parent => {
  return "children" in node && Array.isArray(node.children);
};

interface Paragraph extends Element {
  tagName: "p";
}

const isElement = (node: Node): node is Element => {
  return node.type === "element";
};

const isParagraph = (node: Node): node is Paragraph => {
  return isElement(node) && node.tagName.toLowerCase() === "p";
};

const isParagraphEmpty = (node: Paragraph): boolean => {
  return node.children.length === 0;
};

const joinParagraphs = (a: Paragraph, b: Paragraph): Paragraph => {
  const br: Element = {
    children: [],
    properties: {},
    tagName: "br",
    type: "element"
  };

  return {
    ...a,
    ...b,
    children: [...a.children, br, ...b.children],
    properties: { ...a.properties, ...b.properties }
  };
};

const joinChildren = <T extends Node>(children: T[]): T[] => {
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
};

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
