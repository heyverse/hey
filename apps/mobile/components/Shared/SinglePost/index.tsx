import type { AnyPostFragment, TimelineItemFragment } from "@hey/indexer";
import { memo } from "react";
import { View } from "react-native";
import PostBody from "./PostBody";
import PostWrapper from "./PostWrapper";

interface SinglePostProps {
  timelineItem?: TimelineItemFragment;
  post: AnyPostFragment;
  showMore?: boolean;
  showType?: boolean;
}

const SinglePost = ({
  timelineItem,
  post,
  showMore = true,
  showType = true
}: SinglePostProps) => {
  const rootPost = timelineItem ? timelineItem?.primary : post;

  return (
    <PostWrapper className="px-5 pt-4 pb-3" post={rootPost}>
      <View className="flex items-start gap-x-3">
        <PostBody post={rootPost} showMore={showMore} />
      </View>
    </PostWrapper>
  );
};

export default memo(SinglePost);
