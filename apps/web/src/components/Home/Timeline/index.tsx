import SinglePost from "@/components/Post/SinglePost";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import {
  TimelineEventItemType,
  type TimelineRequest,
  useTimelineQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { memo, useEffect } from "react";
import { WindowVirtualizer } from "virtua";

const Timeline = () => {
  const { currentAccount } = useAccountStore();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

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

  useEffect(() => {
    if (entry?.isIntersecting) {
      onEndReached();
    }
  }, [entry?.isIntersecting]);

  if (loading) {
    return <PostsShimmer />;
  }

  if (!feed?.length) {
    return (
      <EmptyState
        icon={<UserGroupIcon className="size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load timeline" />;
  }

  return (
    <Card className="virtual-divider-list-window">
      <WindowVirtualizer>
        {feed.map((timelineItem, index) => (
          <SinglePost
            key={timelineItem.id}
            timelineItem={timelineItem}
            isFirst={index === 0}
            isLast={index === (feed?.length || 0) - 1}
            post={timelineItem.primary}
          />
        ))}
        {hasMore && <span ref={ref} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default memo(Timeline);
