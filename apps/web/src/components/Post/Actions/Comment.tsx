import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import type { PostFragment } from "@hey/indexer";
import { AnimateNumber } from "motion-plus-react";
import { memo } from "react";
import { useNavigate } from "react-router";
import { Tooltip } from "@/components/Shared/UI";
import humanize from "@/helpers/humanize";

interface CommentProps {
  post: PostFragment;
  showCount: boolean;
}

const Comment = ({ post, showCount }: CommentProps) => {
  const navigate = useNavigate();
  const count = post.stats.comments;
  const iconClassName = showCount
    ? "w-[17px] sm:w-[20px]"
    : "w-[15px] sm:w-[18px]";

  return (
    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-200">
      <button
        aria-label="Comment"
        className="rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        onClick={() => navigate(`/posts/${post.slug}`)}
        type="button"
      >
        <Tooltip
          content={count > 0 ? `${humanize(count)} Comments` : "Comment"}
          placement="top"
          withDelay
        >
          <ChatBubbleLeftIcon className={iconClassName} />
        </Tooltip>
      </button>
      {count > 0 && !showCount ? (
        <AnimateNumber
          className="w-3 text-[11px] sm:text-xs"
          format={{ notation: "compact" }}
          key={`comment-count-${post.id}`}
          transition={{ type: "tween" }}
        >
          {count}
        </AnimateNumber>
      ) : null}
    </div>
  );
};

export default memo(Comment);
