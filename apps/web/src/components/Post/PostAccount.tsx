import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { TRANSFORMS } from "@hey/data/constants";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import type {
  AccountFragment,
  AnyPostFragment,
  PostGroupInfoFragment
} from "@hey/indexer";
import type { ReactNode } from "react";
import { memo } from "react";
import { Link } from "react-router";
import AccountLink from "@/components/Shared/Account/AccountLink";
import AccountPreview from "@/components/Shared/Account/AccountPreview";
import PostLink from "@/components/Shared/Post/PostLink";
import Slug from "@/components/Shared/Slug";
import { Image } from "@/components/Shared/UI";
import formatRelativeOrAbsolute from "@/helpers/datetime/formatRelativeOrAbsolute";

interface PostAccountProps {
  account: AccountFragment;
  group?: PostGroupInfoFragment;
  post: AnyPostFragment;
  timestamp: Date;
}

const PostAccount = ({ account, group, post, timestamp }: PostAccountProps) => {
  const CustomLink = ({ children }: { children: ReactNode }) => (
    <AccountLink
      account={account}
      className="outline-hidden hover:underline focus:underline"
    >
      <AccountPreview
        address={account.address}
        showUserPreview
        username={account.username?.localName}
      >
        {children}
      </AccountPreview>
    </AccountLink>
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-x-1">
        <CustomLink>
          <span className="flex items-center gap-x-1 font-semibold">
            {getAccount(account).name}
            {account.hasSubscribed && (
              <CheckBadgeIcon className="size-4 text-brand-500" />
            )}
          </span>
        </CustomLink>
        <CustomLink>
          <Slug
            className="text-sm"
            slug={getAccount(account).usernameWithPrefix}
          />
        </CustomLink>
        {timestamp ? (
          <span className="text-gray-500 dark:text-gray-200">
            <span className="mr-1">·</span>
            <PostLink className="text-xs hover:underline" post={post}>
              {formatRelativeOrAbsolute(timestamp)}
            </PostLink>
          </span>
        ) : null}
      </div>
      {group?.metadata ? (
        <Link
          className="mt-0.5 mb-2 flex w-fit max-w-sm items-center gap-x-1 text-xs hover:underline focus:underline"
          to={`/g/${group.address}`}
        >
          <Image
            alt={group.metadata.name}
            className="size-4 rounded-sm"
            src={getAvatar(group, TRANSFORMS.AVATAR_TINY)}
          />
          <span className="truncate text-gray-500 dark:text-gray-200">
            {group.metadata.name}
          </span>
        </Link>
      ) : null}
    </div>
  );
};

export default memo(PostAccount);
