import { Image } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getMentions from "@hey/helpers/getMentions";
import type { AccountFragment } from "@hey/indexer";
import { memo } from "react";
import Markup from "../Markup";
import Slug from "../Slug";
import AccountLink from "./AccountLink";
import AccountPreview from "./AccountPreview";
import FollowUnfollowButton from "./FollowUnfollowButton";

interface SingleAccountProps {
  hideFollowButton?: boolean;
  hideUnfollowButton?: boolean;
  isBig?: boolean;
  linkToAccount?: boolean;
  account: AccountFragment;
  showBio?: boolean;
  showUserPreview?: boolean;
}

const SingleAccount = ({
  hideFollowButton = false,
  hideUnfollowButton = false,
  isBig = false,
  linkToAccount = true,
  account,
  showBio = false,
  showUserPreview = true
}: SingleAccountProps) => {
  const UserAvatar = () => (
    <Image
      alt={account.address}
      className={cn(
        isBig ? "size-14" : "size-11",
        "rounded-full border border-gray-200 bg-gray-200 dark:border-gray-700"
      )}
      height={isBig ? 56 : 44}
      loading="lazy"
      src={getAvatar(account)}
      width={isBig ? 56 : 44}
    />
  );

  const UserName = () => (
    <>
      <div className={cn({ "font-bold": isBig }, "grid max-w-sm")}>
        <div className="truncate font-semibold">{getAccount(account).name}</div>
      </div>
      <Slug className="text-sm" slug={getAccount(account).usernameWithPrefix} />
    </>
  );

  const AccountInfo = () => (
    <AccountPreview
      username={account.username?.localName}
      address={account.address}
      showUserPreview={showUserPreview}
    >
      <div className="mr-8 flex items-center gap-x-3">
        <UserAvatar />
        <div>
          <UserName />
        </div>
      </div>
    </AccountPreview>
  );

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        {linkToAccount && account.address ? (
          <AccountLink account={account}>
            <AccountInfo />
          </AccountLink>
        ) : (
          <AccountInfo />
        )}
        <FollowUnfollowButton
          hideFollowButton={hideFollowButton}
          hideUnfollowButton={hideUnfollowButton}
          account={account}
          small
        />
      </div>
      {showBio && account?.metadata?.bio && (
        <div
          className={cn(
            isBig ? "text-base" : "text-sm",
            "mt-2",
            "linkify leading-6"
          )}
          style={{ wordBreak: "break-word" }}
        >
          <Markup mentions={getMentions(account.metadata.bio)}>
            {account?.metadata.bio}
          </Markup>
        </div>
      )}
    </div>
  );
};

export default memo(SingleAccount);
