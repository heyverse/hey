import { Card, Tooltip } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { hono } from "@/helpers/fetcher";
import hasAccess from "@/helpers/hasAccess";
import { QueueListIcon } from "@heroicons/react/24/outline";
import { Features } from "@hey/data/features";
import formatDate from "@hey/helpers/datetime/formatDate";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPostFragment } from "@hey/indexer";
import { useQuery } from "@tanstack/react-query";
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
  const isStaff = hasAccess(Features.Staff);

  const targetPost = isRepost(post) ? post?.repostOf : post;
  const { author, timestamp } = targetPost;

  const { data: accountDetails } = useQuery({
    queryKey: ["account", author.address],
    queryFn: () => hono.account.get(author.address),
    enabled: Boolean(author.address)
  });

  const isSuspended = isStaff ? false : accountDetails?.isSuspended;

  if (isSuspended) {
    return (
      <Card className="!bg-gray-100 dark:!bg-gray-800 m-5" forceRounded>
        <div className="px-4 py-3 text-sm">
          Author Account has been suspended!
        </div>
      </Card>
    );
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
              <div className="my-3 text-gray-500 text-sm dark:text-gray-200">
                <span>{formatDate(timestamp, "hh:mm A · MMM D, YYYY")}</span>
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
                          ? "text-emerald-500 hover:bg-emerald-300/20"
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
