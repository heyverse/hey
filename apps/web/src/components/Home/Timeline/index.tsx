import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import {
  TimelineEventItemType,
  type TimelineRequest,
  useTimelineQuery
} from "@hey/indexer";
import { memo } from "react";

const Timeline = () => {
  const { currentAccount } = useAccountStore();
  const request: TimelineRequest = {
    account: currentAccount?.address,
    filter: {
      eventType: [
        TimelineEventItemType.Post,
        TimelineEventItemType.Quote,
        TimelineEventItemType.Repost
      ]
    }
  };

  const { data, error, fetchMore, loading } = useTimelineQuery({
    variables: { request }
  });

  const feed = data?.timeline?.items;
  const pageInfo = data?.timeline?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  const filteredPosts = (feed ?? []).filter(
    (timelineItem) =>
      !timelineItem.primary.author.operations?.hasBlockedMe &&
      !timelineItem.primary.author.operations?.isBlockedByMe &&
      !timelineItem.primary.operations?.hasReported
  );

  return (
    <PostFeed
      items={filteredPosts}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onEndReached={onEndReached}
      emptyIcon={<UserGroupIcon className="size-8" />}
      emptyMessage="No posts yet!"
      errorTitle="Failed to load timeline"
      renderItem={(timelineItem) => (
        <SinglePost
          key={timelineItem.id}
          timelineItem={timelineItem}
          post={timelineItem.primary}
        />
      )}
    />
  );
};

export default memo(Timeline);
