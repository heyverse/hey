import type { PostFragment } from "@hey/indexer";
import PostWrapper from "@/components/Shared/Post/PostWrapper";
import { PostProvider } from "@/contexts/PostContext";
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
    <PostProvider post={post}>
      <PostWrapper post={post}>
        <div className="relative flex items-start gap-x-3 pb-3">
          <PostAvatar />
          <div className="absolute bottom-0 left-[21px] h-full border-[0.9px] border-gray-300 border-solid dark:border-gray-700" />
          <div className="w-[calc(100%-55px)]">
            <PostHeader />
            {post.isDeleted ? (
              <HiddenPost type={post.__typename} />
            ) : (
              <>
                <PostBody />
                <PostActions />
              </>
            )}
          </div>
        </div>
      </PostWrapper>
    </PostProvider>
  );
};

export default ThreadBody;
