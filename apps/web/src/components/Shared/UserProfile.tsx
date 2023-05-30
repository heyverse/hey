import { ArrowUpIcon, BadgeCheckIcon } from '@heroicons/react/solid';
import { formatTime, getTwitterFormat } from '@lib/formatTime';
import clsx from 'clsx';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import getProfileAttribute from 'lib/getProfileAttribute';
import isVerified from 'lib/isVerified';
import sanitizeDisplayName from 'lib/sanitizeDisplayName';
import Link from 'next/link';
import type { FC } from 'react';
import { memo, useState } from 'react';
import { Image } from 'ui';

import Follow from './Follow';
import Markup from './Markup';
import Slug from './Slug';
import SuperFollow from './SuperFollow';
import UserPreview from './UserPreview';

interface UserProfileProps {
  profile: Profile;
  followStatusLoading?: boolean;
  isFollowing?: boolean;
  isBig?: boolean;
  linkToProfile?: boolean;
  showBio?: boolean;
  showFollow?: boolean;
  showStatus?: boolean;
  showUserPreview?: boolean;
  timestamp?: Date;

  // For data analytics
  followPosition?: number;
  followSource?: string;

  // User is promoted on MadFi
  isPromoted?: boolean;
}

const UserProfile: FC<UserProfileProps> = ({
  profile,
  followStatusLoading = false,
  isFollowing = false,
  isBig = false,
  linkToProfile = true,
  showBio = false,
  showFollow = false,
  showStatus = false,
  showUserPreview = true,
  timestamp = '',
  followPosition,
  followSource,
  isPromoted = false
}) => {
  const [following, setFollowing] = useState(isFollowing);
  const statusEmoji = getProfileAttribute(profile?.attributes, 'statusEmoji');
  const statusMessage = getProfileAttribute(
    profile?.attributes,
    'statusMessage'
  );
  const hasStatus = statusEmoji && statusMessage;

  const UserAvatar = () => (
    <Image
      onError={({ currentTarget }) => {
        currentTarget.src = getAvatar(profile, false);
      }}
      src={getAvatar(profile)}
      loading="lazy"
      className={clsx(
        isBig ? 'h-14 w-14' : 'h-10 w-10',
        'rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={isBig ? 56 : 40}
      width={isBig ? 56 : 40}
      alt={formatHandle(profile?.handle)}
    />
  );

  const UserName = () => (
    <>
      <div className="flex max-w-sm items-center">
        <div className={clsx(isBig ? 'font-bold' : 'text-md', 'grid')}>
          <div className="truncate">
            {sanitizeDisplayName(profile?.name) ??
              formatHandle(profile?.handle)}
          </div>
        </div>
        {isVerified(profile?.id) && (
          <BadgeCheckIcon className="text-brand ml-1 h-4 w-4" />
        )}
        {showStatus && hasStatus ? (
          <div className="lt-text-gray-500 flex items-center">
            <span className="mx-1.5">·</span>
            <span className="flex max-w-[10rem] items-center space-x-1 text-xs">
              <span>{statusEmoji}</span>
              <span className="truncate">{statusMessage}</span>
            </span>
          </div>
        ) : null}
      </div>
      <div>
        <Slug
          className="text-sm"
          slug={formatHandle(profile?.handle)}
          prefix="@"
        />
        {timestamp ? (
          <span className="lt-text-gray-500">
            <span className="mx-1.5">·</span>
            <span className="text-xs" title={formatTime(timestamp as Date)}>
              {getTwitterFormat(timestamp)}
            </span>
          </span>
        ) : null}
      </div>
    </>
  );

  const UserInfo: FC = () => {
    return (
      <UserPreview
        isBig={isBig}
        profile={profile}
        followStatusLoading={followStatusLoading}
        showUserPreview={showUserPreview}
      >
        <div className="flex items-center space-x-3">
          <UserAvatar />
          <div>
            <UserName />
            {showBio && profile?.bio && (
              <div
                // Replace with Tailwind
                style={{ wordBreak: 'break-word' }}
                className={clsx(
                  isBig ? 'text-base' : 'text-sm',
                  'mt-2',
                  'linkify leading-6'
                )}
              >
                <Markup>{profile?.bio}</Markup>
              </div>
            )}
          </div>
        </div>
      </UserPreview>
    );
  };

  return (
    <>
      <div
        className="flex items-center justify-between"
        data-testid={`user-profile-${profile.id}`}
      >
        {linkToProfile ? (
          <Link href={`/u/${formatHandle(profile?.handle)}`}>
            <UserInfo />
          </Link>
        ) : (
          <UserInfo />
        )}
        {showFollow &&
          (followStatusLoading ? (
            <div className="shimmer h-8 w-10 rounded-lg" />
          ) : following ? null : profile?.followModule?.__typename ===
            'FeeFollowModuleSettings' ? (
            <SuperFollow
              profile={profile}
              setFollowing={setFollowing}
              followPosition={followPosition}
              followSource={followSource}
              isPromoted={isPromoted}
            />
          ) : (
            <Follow
              profile={profile}
              setFollowing={setFollowing}
              followPosition={followPosition}
              followSource={followSource}
              isPromoted={isPromoted}
            />
          ))}
      </div>
      {isPromoted && (
        <div className="mt-2 flex items-center">
          <div className="flex w-[85px] items-center rounded-lg bg-gray-200 px-2 dark:bg-gray-700">
            <ArrowUpIcon className="text-brand mr-1 h-5 w-5" />
            <span className="text-xs">Promoted</span>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(UserProfile);
