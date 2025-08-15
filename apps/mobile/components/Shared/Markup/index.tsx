import { Regex } from "@hey/data/regex";
import trimify from "@hey/helpers/trimify";
import type { PostMentionFragment } from "@hey/indexer";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { View } from "react-native";
import remarkBreaks from "remark-breaks";
// @ts-expect-error
import linkifyRegex from "remark-linkify-regex";
import stripMarkdown from "strip-markdown";
import type { PluggableList } from "unified";
import MarkupLink from "./MarkupLink";

const plugins: PluggableList = [
  [stripMarkdown, { keep: ["strong", "emphasis", "list", "listItem"] }],
  remarkBreaks,
  linkifyRegex(Regex.url),
  linkifyRegex(Regex.mention)
];

interface MarkupProps {
  children: string;
  className?: string;
  mentions?: PostMentionFragment[];
}

const Markup = ({ children, className = "", mentions = [] }: MarkupProps) => {
  if (!children) {
    return null;
  }

  const components = {
    a: (props: any) => <MarkupLink mentions={mentions} title={props.title} />
  };

  return (
    <View className={className}>
      <ReactMarkdown components={components} remarkPlugins={plugins}>
        {trimify(children)}
      </ReactMarkdown>
    </View>
  );
};

export default memo(Markup);
