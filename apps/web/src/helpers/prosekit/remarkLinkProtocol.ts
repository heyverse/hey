import type { Root } from "remark-parse/lib";
import type { Plugin } from "unified";
import { visitParents } from "unist-util-visit-parents";

const remarkLinkProtocolTransformer = (root: Root): Root => {
  visitParents(root, "text", (textNode, parentNodes) => {
    const linkNode = parentNodes[parentNodes.length - 1];

    if (linkNode?.type !== "link") {
      return;
    }

    if (textNode.value !== linkNode.url) {
      return;
    }

    const { url } = linkNode;

    if (url.includes("//")) {
      return;
    }

    textNode.value = `https://${url}`;
    linkNode.url = `https://${url}`;
  });

  return root;
};

export const remarkLinkProtocol: Plugin<[], Root> = () =>
  remarkLinkProtocolTransformer;
