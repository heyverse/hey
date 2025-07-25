import type { PostFragment } from "@hey/indexer";
import { memo } from "react";
import PostWrapper from "@/components/Shared/Post/PostWrapper";
import PostActions from "./Actions";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

interface ThreadBodyProps {
  post: PostFragment;
}

const ThreadBody = ({ post }: ThreadBodyProps) => {
  return (
    <PostWrapper post={post}>
      <div className="relative flex items-start gap-x-3 pb-3">
        <PostAvatar post={post} />
        <div className="absolute bottom-0 left-[21px] h-full border-[0.9px] border-gray-300 border-solid dark:border-gray-700" />
        <div className="w-[calc(100%-55px)]">
          <PostHeader post={post} />
          {post.isDeleted ? (
            <HiddenPost type={post.__typename} />
          ) : (
            <>
              <PostBody post={post} />
              <PostActions post={post} />
            </>
          )}
        </div>
      </div>
    </PostWrapper>
  );
};

export default memo(ThreadBody);
