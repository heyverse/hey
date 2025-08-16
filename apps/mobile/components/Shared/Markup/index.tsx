import type { PostMentionFragment } from "@hey/indexer";
import React from "react";
import { View } from "react-native";
import Markdown from "react-native-markdown-display";
import MarkupLink from "./MarkupLink";

interface MarkupProps {
  children: string;
  className?: string;
  mentions?: PostMentionFragment[];
}

const Markup = ({ children, className = "", mentions = [] }: MarkupProps) => {
  if (!children) {
    return null;
  }

  return (
    <View className={className}>
      <Markdown
        rules={{
          link: (node) => (
            <MarkupLink
              key={node.attributes.href}
              mentions={mentions}
              title={node.attributes.href}
            />
          )
        }}
        style={{
          body: { fontSize: 14 },
          em: { fontStyle: "italic" },
          link: { color: "blue" },
          strong: { fontWeight: "bold" }
        }}
      >
        {children}
      </Markdown>
    </View>
  );
};

export default React.memo(Markup);
