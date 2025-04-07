import { Image } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { isRepost } from "@hey/helpers/postHelpers";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AnyPostFragment, TimelineItemFragment } from "@hey/indexer";
import { memo } from "react";
import { Link, useNavigate } from "react-router";

interface PostAvatarProps {
  timelineItem?: TimelineItemFragment;
  post: AnyPostFragment;
  quoted?: boolean;
}

const PostAvatar = ({
  timelineItem,
  post,
  quoted = false
}: PostAvatarProps) => {
  const navigate = useNavigate();
  const targetPost = isRepost(post) ? post?.repostOf : post;
  const rootPost = timelineItem ? timelineItem?.primary : targetPost;
  const account = timelineItem ? rootPost.author : targetPost.author;

  return (
    <Link
      className="contents"
      to={getAccount(account).link}
      onClick={stopEventPropagation}
    >
      <Image
        alt={account.address}
        className={cn(
          quoted ? "size-6" : "size-11",
          "z-[1] cursor-pointer rounded-full border border-gray-200 bg-gray-200 dark:border-gray-700"
        )}
        height={quoted ? 25 : 44}
        loading="lazy"
        onClick={() => navigate(getAccount(account).link)}
        src={getAvatar(account)}
        width={quoted ? 25 : 44}
      />
    </Link>
  );
};

export default memo(PostAvatar);
