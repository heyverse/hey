import { usePostStore } from "@/store/non-persisted/post/usePostStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { isRepost } from "@hey/helpers/postHelpers";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type {
  AnyPostFragment,
  PostGroupInfoFragment,
  TimelineItemFragment
} from "@hey/indexer";
import PostMenu from "./Actions/Menu";
import PostAccount from "./PostAccount";

interface PostHeaderProps {
  timelineItem?: TimelineItemFragment;
  isNew?: boolean;
  post: AnyPostFragment;
  quoted?: boolean;
}

const PostHeader = ({
  timelineItem,
  isNew = false,
  post,
  quoted = false
}: PostHeaderProps) => {
  const { setQuotedPost } = usePostStore();

  const targetPost = isRepost(post) ? post?.repostOf : post;
  const rootPost = timelineItem ? timelineItem?.primary : targetPost;
  const account = timelineItem ? rootPost.author : targetPost.author;
  const timestamp = timelineItem ? rootPost.timestamp : targetPost.timestamp;

  return (
    <div
      className="flex w-full items-start justify-between"
      onClick={stopEventPropagation}
    >
      <PostAccount
        account={account}
        group={targetPost.feed?.group as PostGroupInfoFragment}
        post={targetPost}
        timestamp={timestamp}
      />
      {!post.isDeleted && !quoted ? (
        <PostMenu post={targetPost} />
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
