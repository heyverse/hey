import { Regex } from "@hey/data/regex";
import type { PostMentionFragment } from "@hey/indexer";
import { lazy, memo, Suspense, useMemo } from "react";
import remarkBreaks from "remark-breaks";
// @ts-expect-error
import linkifyRegex from "remark-linkify-regex";
import stripMarkdown from "strip-markdown";
import trimify from "@/helpers/trimify";
import MarkupLink from "./MarkupLink";

// Lazy load ReactMarkdown for better initial bundle size
const ReactMarkdown = lazy(() => import("react-markdown"));

const plugins = [
  [stripMarkdown, { keep: ["strong", "emphasis", "list", "listItem"] }],
  remarkBreaks,
  linkifyRegex(Regex.url),
  linkifyRegex(Regex.mention)
];

interface LazyMarkupProps {
  children: string;
  className?: string;
  mentions?: PostMentionFragment[];
}

const LazyMarkup = ({
  children,
  className = "",
  mentions = []
}: LazyMarkupProps) => {
  const trimmedContent = useMemo(() => {
    if (!children) return null;
    return trimify(children);
  }, [children]);

  const components = useMemo(
    () => ({
      a: (props: any) => <MarkupLink mentions={mentions} title={props.title} />
    }),
    [mentions]
  );

  if (!trimmedContent) {
    return null;
  }

  return (
    <span className={className}>
      <Suspense fallback={<span>{trimmedContent}</span>}>
        <ReactMarkdown components={components} remarkPlugins={plugins}>
          {trimmedContent}
        </ReactMarkdown>
      </Suspense>
    </span>
  );
};

export default memo(LazyMarkup);
