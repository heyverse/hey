import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { rehypeJoinParagraph } from "./rehypeJoinParagraph";
import { customBreakHandler } from "./remarkBreakHandler";
import { remarkLinkProtocol } from "./remarkLinkProtocol";

// By default, remark-stringify escapes underscores (i.e. "_" => "\_"). We want
// to disable this behavior so that we can have underscores in mention usernames.
const unescapeUnderscore = (str: string) => {
  return str.replace(/(^|[^\\])\\_/g, "$1_");
};

export const markdownFromHTML = (html: string): string => {
  const markdown = unified()
    .use(rehypeParse)
    .use(rehypeJoinParagraph)
    .use(rehypeRemark, { newlines: true })
    .use(remarkLinkProtocol)
    .use(remarkStringify, {
      handlers: { break: customBreakHandler, hardBreak: customBreakHandler }
    })
    .processSync(html)
    .toString();

  return unescapeUnderscore(markdown);
};

export const htmlFromMarkdown = (markdown: string): string => {
  return unified()
    .use(remarkParse)
    .use(remarkHtml)
    .processSync(markdown)
    .toString();
};
