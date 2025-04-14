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
import { memo, useRef } from "react";
import type { StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";

let virtuosoState: any = { ranges: [], screenTop: 0 };

const Timeline = () => {
  const { currentAccount } = useAccountStore();
  const virtuoso = useRef<VirtuosoHandle>(null);

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

  const onScrolling = (scrolling: boolean) => {
    if (!scrolling) {
      virtuoso?.current?.getState((state: StateSnapshot) => {
        virtuosoState = { ...state };
      });
    }
  };

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

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
    <Card>
      <Virtuoso
        className="virtual-divider-list-window"
        data={feed}
        endReached={onEndReached}
        isScrolling={onScrolling}
        itemContent={(index, timelineItem) => (
          <SinglePost
            timelineItem={timelineItem}
            isFirst={index === 0}
            isLast={index === (feed?.length || 0) - 1}
            post={timelineItem.primary}
          />
        )}
        ref={virtuoso}
        restoreStateFrom={
          virtuosoState.ranges.length
            ? virtuosoState
            : virtuosoState?.current?.getState((state: StateSnapshot) => state)
        }
        useWindowScroll
      />
    </Card>
  );
};

export default memo(Timeline);
