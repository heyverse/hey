import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { TRANSFORMS } from "@hey/data/constants";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import type {
  AccountFragment,
  AnyPostFragment,
  PostGroupInfoFragment
} from "@hey/indexer";
import { memo } from "react";
import { Link } from "react-router";
import AccountLink from "@/components/Shared/Account/AccountLink";
import AccountPreview from "@/components/Shared/Account/AccountPreview";
import PostLink from "@/components/Shared/Post/PostLink";
import { Image } from "@/components/Shared/UI";
import formatRelativeOrAbsolute from "@/helpers/datetime/formatRelativeOrAbsolute";

interface PostAccountProps {
  account: AccountFragment;
  group?: PostGroupInfoFragment;
  post: AnyPostFragment;
  timestamp: Date;
}

const PostAccount = ({ account, group, post, timestamp }: PostAccountProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-x-1">
        <AccountLink
          account={account}
          className="outline-hidden hover:underline focus:underline"
        >
          <AccountPreview
            address={account.address}
            showUserPreview
            username={account.username?.localName}
          >
            <span className="flex items-center gap-x-1 font-semibold">
              {account.preferNameInFeed
                ? getAccount(account).name
                : getAccount(account).usernameWithPrefix}
              {account.hasSubscribed && (
                <CheckBadgeIcon className="size-4 text-brand-500" />
              )}
            </span>
          </AccountPreview>
        </AccountLink>
        {group?.metadata ? (
          <>
            <ChevronRightIcon className="size-4 text-gray-500" />
            <Link
              className="flex items-center gap-x-1 hover:underline focus:underline"
              to={`/g/${group.address}`}
            >
              <Image
                alt={group.metadata.name}
                className="size-4 rounded-sm"
                src={getAvatar(group, TRANSFORMS.AVATAR_TINY)}
              />
              <span className="truncate text-sm">{group.metadata.name}</span>
            </Link>
          </>
        ) : null}
        {timestamp ? (
          <span className="ml-1 text-gray-500 dark:text-gray-200">
            <PostLink className="text-sm hover:underline" post={post}>
              {formatRelativeOrAbsolute(timestamp)}
            </PostLink>
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default memo(PostAccount);
