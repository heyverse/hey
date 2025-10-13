import type { AnyPostFragment, TimelineItemFragment } from "@hey/indexer";
import { memo } from "react";
import ActionType from "@/components/Home/Timeline/EventType";
import PostWrapper from "@/components/Shared/Post/PostWrapper";
import usePostView from "@/hooks/usePostView";
import PostActions from "./Actions";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";
import PostType from "./Type";

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
  usePostView({ slug: rootPost.slug });

  return (
    <PostWrapper className="cursor-pointer px-5 pt-4 pb-3" post={rootPost}>
      {timelineItem ? (
        <ActionType timelineItem={timelineItem} />
      ) : (
        <PostType post={post} showType={showType} />
      )}
      <div className="flex items-start gap-x-3">
        <PostAvatar post={rootPost} timelineItem={timelineItem} />
        <div className="w-[calc(100%-55px)]">
          <PostHeader post={rootPost} timelineItem={timelineItem} />
          {post.isDeleted ? (
            <HiddenPost type={post.__typename} />
          ) : (
            <>
              <PostBody post={rootPost} showMore={showMore} />
              <PostActions post={rootPost} />
            </>
          )}
        </div>
      </div>
    </PostWrapper>
  );
};

export default memo(SinglePost);
