import type { PostFragment } from "@hey/indexer";
import PostWarning from "@/components/Shared/Post/PostWarning";
import PostWrapper from "@/components/Shared/Post/PostWrapper";
import { PostProvider } from "@/contexts/PostContext";
import {
  getBlockedByMeMessage,
  getBlockedMeMessage
} from "@/helpers/getBlockedMessage";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

interface QuotedPostProps {
  isNew?: boolean;
  post: PostFragment;
}

const QuotedPost = ({ isNew = false, post }: QuotedPostProps) => {
  const isBlockededByMe = post.author.operations?.isBlockedByMe;
  const hasBlockedMe = post.author.operations?.hasBlockedMe;

  if (hasBlockedMe) {
    return <PostWarning message={getBlockedMeMessage(post.author)} />;
  }

  if (isBlockededByMe) {
    return <PostWarning message={getBlockedByMeMessage(post.author)} />;
  }

  return (
    <PostProvider post={post}>
      <PostWrapper
        className="cursor-pointer p-4 first:rounded-t-xl last:rounded-b-xl"
        post={post}
      >
        <div className="flex items-center gap-x-2">
          <PostAvatar quoted />
          <PostHeader isNew={isNew} quoted />
        </div>
        {post.isDeleted ? (
          <HiddenPost type={post.__typename} />
        ) : (
          <PostBody quoted showMore />
        )}
      </PostWrapper>
    </PostProvider>
  );
};

export default QuotedPost;
