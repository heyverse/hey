import { QueueListIcon } from "@heroicons/react/24/outline";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPostFragment } from "@hey/indexer";
import dayjs from "dayjs";
import PostWarning from "@/components/Shared/Post/PostWarning";
import { Tooltip } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import {
  getBlockedByMeMessage,
  getBlockedMeMessage
} from "@/helpers/getBlockedMessage";
import { useHiddenCommentFeedStore } from ".";
import PostActions from "./Actions";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";
import PostStats from "./PostStats";
import PostType from "./Type";

interface FullPostProps {
  hasHiddenComments: boolean;
  post: AnyPostFragment;
}

const FullPost = ({ hasHiddenComments, post }: FullPostProps) => {
  const { setShowHiddenComments, showHiddenComments } =
    useHiddenCommentFeedStore();

  const targetPost = isRepost(post) ? post?.repostOf : post;
  const { timestamp } = targetPost;

  const isBlockedByMe = post.author.operations?.isBlockedByMe;
  const hasBlockedMe = post.author.operations?.hasBlockedMe;

  if (hasBlockedMe) {
    return <PostWarning message={getBlockedMeMessage(post.author)} />;
  }

  if (isBlockedByMe) {
    return <PostWarning message={getBlockedByMeMessage(post.author)} />;
  }

  return (
    <article className="p-5">
      <PostType post={post} showType />
      <div className="flex items-start gap-x-3">
        <PostAvatar post={post} />
        <div className="w-[calc(100%-55px)]">
          <PostHeader post={targetPost} />
          {targetPost.isDeleted ? (
            <HiddenPost type={targetPost.__typename} />
          ) : (
            <>
              <PostBody
                contentClassName="full-page-post-markup"
                post={targetPost}
              />
              <div className="my-3 flex items-center text-gray-500 text-sm dark:text-gray-200">
                {dayjs(timestamp).format("h:mm A · MMM D, YYYY")}
                {targetPost.isEdited ? " · Edited" : null}
                {targetPost.app?.metadata?.name
                  ? ` · ${targetPost.app?.metadata?.name}`
                  : null}
              </div>
              <PostStats post={targetPost} />
              <div className="divider" />
              <div className="flex items-center justify-between">
                <PostActions post={targetPost} showCount />
                {hasHiddenComments ? (
                  <div className="mt-2">
                    <button
                      aria-label="Like"
                      className={cn(
                        showHiddenComments
                          ? "text-black hover:bg-gray-500/20"
                          : "text-gray-500 hover:bg-gray-300/20 dark:text-gray-200",
                        "rounded-full p-1.5 outline-offset-2"
                      )}
                      onClick={() => setShowHiddenComments(!showHiddenComments)}
                      type="button"
                    >
                      <Tooltip
                        content={
                          showHiddenComments
                            ? "Hide hidden comments"
                            : "Show hidden comments"
                        }
                        placement="top"
                        withDelay
                      >
                        <QueueListIcon className="size-5" />
                      </Tooltip>
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default FullPost;
