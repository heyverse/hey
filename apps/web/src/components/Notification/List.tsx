import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import { BellIcon } from "@heroicons/react/24/outline";
import { NotificationFeedType } from "@hey/data/enums";
import {
  type NotificationRequest,
  NotificationType,
  useNotificationsQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { WindowVirtualizer } from "virtua";
import NotificationShimmer from "./Shimmer";
import CommentNotification from "./Type/CommentNotification";
import FollowNotification from "./Type/FollowNotification";
import MentionNotification from "./Type/MentionNotification";
import PostActionExecutedNotification from "./Type/PostActionExecutedNotification";
import QuoteNotification from "./Type/QuoteNotification";
import ReactionNotification from "./Type/ReactionNotification";
import RepostNotification from "./Type/RepostNotification";

interface ListProps {
  feedType: string;
}

const List = ({ feedType }: ListProps) => {
  const { includeLowScore } = usePreferencesStore();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

  const getNotificationType = () => {
    switch (feedType) {
      case NotificationFeedType.All:
        return;
      case NotificationFeedType.Mentions:
        return [NotificationType.Mentioned];
      case NotificationFeedType.Comments:
        return [NotificationType.Commented];
      case NotificationFeedType.Likes:
        return [NotificationType.Reacted];
      case NotificationFeedType.PostActions:
        return [NotificationType.ExecutedPostAction];
      default:
        return;
    }
  };

  const request: NotificationRequest = {
    filter: {
      includeLowScore,
      notificationTypes: getNotificationType()
    }
  };

  const { data, error, fetchMore, loading } = useNotificationsQuery({
    variables: { request }
  });

  const notifications = data?.notifications?.items;
  const pageInfo = data?.notifications?.pageInfo;
  const hasMore = !!pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo.next } }
      });
    }
  };

  useEffect(() => {
    if (entry?.isIntersecting) {
      onEndReached();
    }
  }, [entry?.isIntersecting]);

  if (loading) {
    return (
      <Card className="divide-y divide-gray-200 dark:divide-gray-700">
        <NotificationShimmer />
        <NotificationShimmer />
        <NotificationShimmer />
        <NotificationShimmer />
      </Card>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load notifications" />;
  }

  if (!notifications?.length) {
    return (
      <EmptyState
        icon={<BellIcon className="size-8" />}
        message="Inbox zero!"
      />
    );
  }

  return (
    <Card className="virtual-divider-list-window">
      <WindowVirtualizer>
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={cn({
              "p-5": notification.__typename !== "FollowNotification"
            })}
          >
            {notification.__typename === "FollowNotification" && (
              <FollowNotification notification={notification} />
            )}
            {notification.__typename === "MentionNotification" && (
              <MentionNotification notification={notification} />
            )}
            {notification.__typename === "ReactionNotification" && (
              <ReactionNotification notification={notification} />
            )}
            {notification.__typename === "CommentNotification" && (
              <CommentNotification notification={notification} />
            )}
            {notification.__typename === "RepostNotification" && (
              <RepostNotification notification={notification} />
            )}
            {notification.__typename === "QuoteNotification" && (
              <QuoteNotification notification={notification} />
            )}
            {notification.__typename === "PostActionExecutedNotification" && (
              <PostActionExecutedNotification notification={notification} />
            )}
          </div>
        ))}
        {hasMore && <span ref={ref} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default List;
