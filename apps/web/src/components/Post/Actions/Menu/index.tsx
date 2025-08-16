import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import type { PostFragment } from "@hey/indexer";
import { Fragment } from "react";
import MenuTransition from "@/components/Shared/MenuTransition";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import Bookmark from "./Bookmark";
import CopyPostText from "./CopyPostText";
import Delete from "./Delete";
import Edit from "./Edit";
import HideComment from "./HideComment";
import NotInterested from "./NotInterested";
import Report from "./Report";
import Share from "./Share";

interface PostMenuProps {
  post: PostFragment;
}

const PostMenu = ({ post }: PostMenuProps) => {
  const { currentAccount } = useAccountStore();
  const canEdit =
    post.operations?.canEdit.__typename === "PostOperationValidationPassed";
  const iconClassName = "w-[15px] sm:w-[18px]";

  return (
    <Menu as="div" className="relative">
      <MenuButton as={Fragment}>
        <button
          aria-label="More"
          className="rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          type="button"
        >
          <EllipsisHorizontalIcon
            className={cn("text-gray-500 dark:text-gray-200", iconClassName)}
          />
        </button>
      </MenuButton>
      <MenuTransition>
        <MenuItems
          anchor="bottom end"
          className="z-[5] mt-2 w-max origin-top-right rounded-xl border border-gray-200 bg-white shadow-xs focus:outline-hidden dark:border-gray-700 dark:bg-gray-900"
          static
        >
          {currentAccount ? (
            <>
              <NotInterested post={post} />
              <HideComment post={post} />
              <Bookmark post={post} />
              <div className="divider" />
            </>
          ) : null}
          <Share post={post} />
          <CopyPostText post={post} />
          <div className="divider" />
          {currentAccount?.address === post?.author?.address ? (
            <>
              {canEdit && currentAccount?.hasSubscribed ? (
                <Edit post={post} />
              ) : null}
              <Delete post={post} />
            </>
          ) : (
            <Report post={post} />
          )}
        </MenuItems>
      </MenuTransition>
    </Menu>
  );
};

export default PostMenu;
