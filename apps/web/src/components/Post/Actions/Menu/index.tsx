import MenuTransition from "@/components/Shared/MenuTransition";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { PostFragment } from "@hey/indexer";
import { Fragment } from "react";
import Bookmark from "./Bookmark";
import CopyPostText from "./CopyPostText";
import Delete from "./Delete";
import HideComment from "./HideComment";
import NotInterested from "./NotInterested";
import Report from "./Report";
import Share from "./Share";

interface PostMenuProps {
  post: PostFragment;
}

const PostMenu = ({ post }: PostMenuProps) => {
  const { currentAccount } = useAccountStore();
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
            className={cn("ld-text-gray-500", iconClassName)}
          />
        </button>
      </MenuButton>
      <MenuTransition>
        <MenuItems
          className="absolute right-0 z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          {currentAccount ? (
            <>
              <NotInterested post={post} />
              <HideComment post={post} />
              <Bookmark post={post} />
            </>
          ) : null}
          <div className="divider" />
          <Share post={post} />
          <CopyPostText post={post} />
          <div className="divider" />
          {currentAccount?.address === post?.author?.address ? (
            <Delete post={post} />
          ) : (
            <Report post={post} />
          )}
        </MenuItems>
      </MenuTransition>
    </Menu>
  );
};

export default PostMenu;
