import getPostData from "@hey/helpers/getPostData";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPostFragment } from "@hey/indexer";
import clsx from "clsx";
import { memo } from "react";
import { View } from "react-native";
import Markup from "../Markup";

interface PostBodyProps {
  contentClassName?: string;
  post: AnyPostFragment;
  quoted?: boolean;
  showMore?: boolean;
}

const PostBody = ({
  contentClassName = "",
  post,
  quoted = false,
  showMore = false
}: PostBodyProps) => {
  const targetPost = isRepost(post) ? post.repostOf : post;
  const { metadata } = targetPost;

  const filteredContent = getPostData(metadata)?.content || "";
  const canShowMore = filteredContent?.length > 450 && showMore;

  let content = filteredContent;

  if (canShowMore) {
    const lines = content?.split("\n");
    if (lines && lines.length > 0) {
      content = lines.slice(0, 5).join("\n");
    }
  }

  return (
    <View className="break-words">
      <Markup
        className={clsx(
          { "line-clamp-5": canShowMore },
          "markup linkify break-words",
          contentClassName
        )}
        mentions={targetPost.mentions}
      >
        {content}
      </Markup>
    </View>
  );
};

export default memo(PostBody);
