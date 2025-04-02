import { Card, Image } from "@/components/Shared/UI";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getMentions from "@hey/helpers/getMentions";
import nFormatter from "@hey/helpers/nFormatter";
import truncateByWords from "@hey/helpers/truncateByWords";
import { type AccountStats, useFullAccountLazyQuery } from "@hey/indexer";
import * as HoverCard from "@radix-ui/react-hover-card";
import plur from "plur";
import type { ReactNode } from "react";
import FollowUnfollowButton from "./Account/FollowUnfollowButton";
import Verified from "./Account/Icons/Verified";
import Markup from "./Markup";
import Slug from "./Slug";

interface AccountPreviewProps {
  children: ReactNode;
  username?: string;
  address?: string;
  showUserPreview?: boolean;
}

const AccountPreview = ({
  children,
  username,
  address,
  showUserPreview = true
}: AccountPreviewProps) => {
  const [loadAccount, { data, loading }] = useFullAccountLazyQuery();
  const account = data?.account;
  const stats = data?.accountStats as AccountStats;

  const onPreviewStart = async () => {
    if (account || loading) {
      return;
    }

    await loadAccount({
      variables: {
        accountRequest: {
          ...(address
            ? { address }
            : { username: { localName: username as string } })
        },
        accountStatsRequest: { account: address }
      }
    });
  };

  if (!address && !username) {
    return null;
  }

  if (!showUserPreview) {
    return <span>{children}</span>;
  }

  const Preview = () => {
    if (loading) {
      return (
        <div className="flex flex-col">
          <div className="flex p-3">
            <div>{username || `#${address}`}</div>
          </div>
        </div>
      );
    }

    if (!account) {
      return (
        <div className="flex h-12 items-center px-3">No account found</div>
      );
    }

    const UserAvatar = () => (
      <Image
        alt={account.address}
        className="size-12 rounded-full border border-neutral-200 bg-neutral-200 dark:border-neutral-700"
        height={48}
        loading="lazy"
        src={getAvatar(account)}
        width={48}
      />
    );

    const UserName = () => (
      <div>
        <div className="flex max-w-sm items-center gap-1 truncate">
          <div className="text-md">{getAccount(account).name}</div>
          <Verified address={account.address} iconClassName="size-4" />
        </div>
        <span>
          <Slug
            className="text-sm"
            slug={getAccount(account).usernameWithPrefix}
          />
          {account.operations?.isFollowingMe && (
            <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 text-xs dark:bg-neutral-700">
              Follows you
            </span>
          )}
        </span>
      </div>
    );

    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <UserAvatar />
          <FollowUnfollowButton account={account} small />
        </div>
        <UserName />
        {account.metadata?.bio && (
          <div className="linkify mt-2 break-words text-sm leading-6">
            <Markup mentions={getMentions(account.metadata.bio)}>
              {truncateByWords(account.metadata.bio, 20)}
            </Markup>
          </div>
        )}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="text-base">
              {nFormatter(stats.graphFollowStats?.following)}
            </div>
            <div className="text-neutral-500 text-sm dark:text-neutral-200">
              Following
            </div>
          </div>
          <div className="flex items-center space-x-1 text-md">
            <div className="text-base">
              {nFormatter(stats.graphFollowStats?.followers)}
            </div>
            <div className="text-neutral-500 text-sm dark:text-neutral-200">
              {plur("Follower", stats.graphFollowStats?.followers)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <span onFocus={onPreviewStart} onMouseOver={onPreviewStart}>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <span>{children}</span>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            asChild
            className="z-10 w-72"
            side="bottom"
            sideOffset={5}
          >
            <div>
              <Card forceRounded>
                <Preview />
              </Card>
            </div>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </span>
  );
};

export default AccountPreview;
