import getAvatar from "@hey/helpers/getAvatar";
import { memo } from "react";
import AccountLink from "@/components/Shared/Account/AccountLink";
import { Image } from "@/components/Shared/UI";
import { usePostContext } from "@/contexts/PostContext";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";

interface PostAvatarProps {
  quoted?: boolean;
}

const PostAvatar = ({ quoted = false }: PostAvatarProps) => {
  const { timelineItem, targetPost, rootPost } = usePostContext();
  const account = timelineItem ? rootPost.author : targetPost.author;

  return (
    <AccountLink
      account={account}
      className="contents"
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
        src={getAvatar(account)}
        width={quoted ? 25 : 44}
      />
    </AccountLink>
  );
};

export default memo(PostAvatar);
