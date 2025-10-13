import { BeakerIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { type AccountStats, useFullAccountLazyQuery } from "@hey/indexer";
import * as HoverCard from "@radix-ui/react-hover-card";
import plur from "plur";
import type { ReactNode } from "react";
import Markup from "@/components/Shared/Markup";
import Slug from "@/components/Shared/Slug";
import { Card, Image } from "@/components/Shared/UI";
import getMentions from "@/helpers/getMentions";
import nFormatter from "@/helpers/nFormatter";
import truncateByWords from "@/helpers/truncateByWords";
import FollowUnfollowButton from "./FollowUnfollowButton";

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
        className="size-12 rounded-full border border-gray-200 bg-gray-200 dark:border-gray-700"
        height={48}
        loading="lazy"
        src={getAvatar(account)}
        width={48}
      />
    );

    const UserName = () => (
      <div>
        <div className="flex max-w-sm items-center gap-1 truncate">
          <div>{getAccount(account).name}</div>
          {account.hasSubscribed && (
            <CheckBadgeIcon className="size-4 text-brand-500" />
          )}
          {account.isBeta && <BeakerIcon className="size-4 text-green-500" />}
        </div>
        <span>
          <Slug
            className="text-sm"
            slug={getAccount(account).usernameWithPrefix}
          />
          {account.operations?.isFollowingMe && (
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700">
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
            <div className="text-gray-500 text-sm dark:text-gray-200">
              Following
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="text-base">
              {nFormatter(stats.graphFollowStats?.followers)}
            </div>
            <div className="text-gray-500 text-sm dark:text-gray-200">
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
