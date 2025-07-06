import { XMarkIcon } from "@heroicons/react/24/outline";
import type { PostGroupInfoFragment } from "@hey/indexer";
import PostMenu from "@/components/Post/Actions/Menu";
import { usePostContext } from "@/contexts/PostContext";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { usePostStore } from "@/store/non-persisted/post/usePostStore";
import PostAccount from "./PostAccount";

interface PostHeaderProps {
  isNew?: boolean;
  quoted?: boolean;
}

const PostHeader = ({ isNew = false, quoted = false }: PostHeaderProps) => {
  const { setQuotedPost } = usePostStore();
  const { post, timelineItem, targetPost, rootPost } = usePostContext();
  // Type assertion to handle AnyPostFragment vs PostFragment type difference
  const targetPostTyped = targetPost as any;

  const account = timelineItem ? rootPost.author : targetPost.author;
  const timestamp = timelineItem ? rootPost.timestamp : targetPost.timestamp;

  return (
    <div
      className="flex w-full items-start justify-between"
      onClick={stopEventPropagation}
    >
      <PostAccount
        account={account}
        group={targetPostTyped.feed?.group as PostGroupInfoFragment}
        post={targetPost}
        timestamp={timestamp}
      />
      {!post.isDeleted && !quoted ? (
        <PostMenu post={targetPostTyped} />
      ) : (
        <div className="size-[30px]" />
      )}
      {quoted && isNew ? (
        <button
          aria-label="Remove Quote"
          className="rounded-full border border-gray-200 p-1.5 hover:bg-gray-300/20 dark:border-gray-700"
          onClick={() => setQuotedPost()}
          type="reset"
        >
          <XMarkIcon className="size-4 text-gray-500 dark:text-gray-200" />
        </button>
      ) : null}
    </div>
  );
};

export default PostHeader;
