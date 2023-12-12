import type { Profile, ProfileSearchRequest } from '@hey/lens';

import UserProfilesShimmer from '@components/Shared/Shimmer/UserProfilesShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import {
  CustomFiltersType,
  LimitType,
  useSearchProfilesQuery
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC, type ReactNode, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface ProfilesProps {
  query: string;
}

const Profiles: FC<ProfilesProps> = ({ query }) => {
  // Variables
  const request: ProfileSearchRequest = {
    limit: LimitType.TwentyFive,
    query,
    where: { customFilters: [CustomFiltersType.Gardeners] }
  };

  const profileCache = useRef<Record<string, ReactNode>>({});

  const { data, error, fetchMore, loading } = useSearchProfilesQuery({
    skip: !query,
    variables: { request }
  });

  const search = data?.searchProfiles;
  const profiles = search?.items;
  const pageInfo = search?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <UserProfilesShimmer isBig />;
  }

  if (profiles?.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="text-brand-500 h-8 w-8" />}
        message={
          <span>
            No profiles for <b>&ldquo;{query}&rdquo;</b>
          </span>
        }
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load profiles" />;
  }

  return (
    <Virtuoso
      className="[&>div>div]:space-y-3"
      data={profiles}
      endReached={onEndReached}
      itemContent={(_, profile) => {
        if (profileCache.current[profile?.id]) {
          return profileCache.current[profile?.id];
        }

        const profileCard = (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <Card className="p-5" key={profile?.id}>
              <UserProfile isBig profile={profile as Profile} showBio />
            </Card>
          </motion.div>
        );

        profileCache.current[profile?.id] = profileCard;

        return profileCard;
      }}
      useWindowScroll
    />
  );
};

export default Profiles;
