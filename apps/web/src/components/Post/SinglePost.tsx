import ActionType from "@/components/Home/Timeline/EventType";
import PostWrapper from "@/components/Shared/Post/PostWrapper";
import cn from "@/helpers/cn";
import { usePostSmartMedia } from "@/store/non-persisted/post/useSmartMediaStore";
import type { AnyPostFragment, Post, TimelineItemFragment } from "@hey/indexer";
import { memo, useEffect } from "react";
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
  const { smartMedia, fetchSmartMedia } = usePostSmartMedia(post.slug);

  useEffect(() => {
    if (!(post as Post).root) fetchSmartMedia(post as Post, false);
  }, [post, fetchSmartMedia]);

  return (
    <PostWrapper className="cursor-pointer px-5 pt-4 pb-3" post={rootPost}>
      {timelineItem ? (
        <ActionType timelineItem={timelineItem} />
      ) : (
        <PostType post={post} showType={showType} />
      )}
      <div className="flex items-start gap-x-3">
        <PostAvatar timelineItem={timelineItem} post={rootPost} />
        <div className="w-[calc(100%-55px)]">
          <PostHeader
            timelineItem={timelineItem}
            post={rootPost}
            smartMedia={smartMedia}
          />
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
