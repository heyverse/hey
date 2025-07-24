import { BellIcon } from "@heroicons/react/24/outline";
import { NotificationFeedType } from "@hey/data/enums";
import {
  type NotificationRequest,
  NotificationType,
  useNotificationsQuery
} from "@hey/indexer";
import { memo, useCallback } from "react";
import { WindowVirtualizer } from "virtua";
import AccountActionExecutedNotification from "@/components/Notification/Type/AccountActionExecutedNotification";
import CommentNotification from "@/components/Notification/Type/CommentNotification";
import FollowNotification from "@/components/Notification/Type/FollowNotification";
import MentionNotification from "@/components/Notification/Type/MentionNotification";
import PostActionExecutedNotification from "@/components/Notification/Type/PostActionExecutedNotification";
import QuoteNotification from "@/components/Notification/Type/QuoteNotification";
import ReactionNotification from "@/components/Notification/Type/ReactionNotification";
import RepostNotification from "@/components/Notification/Type/RepostNotification";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import NotificationShimmer from "./Shimmer";
import TokenDistributedNotification from "./Type/TokenDistributedNotification";

const notificationComponentMap = {
  AccountActionExecutedNotification,
  CommentNotification,
  FollowNotification,
  MentionNotification,
  PostActionExecutedNotification,
  QuoteNotification,
  ReactionNotification,
  RepostNotification,
  TokenDistributedNotification
} as const;

interface ListProps {
  feedType: string;
}

const List = ({ feedType }: ListProps) => {
  const { includeLowScore } = usePreferencesStore();

  const getNotificationType = useCallback(() => {
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
      case NotificationFeedType.Rewards:
        return [NotificationType.TokenDistributed];
      default:
        return;
    }
  }, [feedType]);

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

  const handleEndReached = useCallback(async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  }, [fetchMore, hasMore, pageInfo?.next, request]);

  const loadMoreRef = useLoadMoreOnIntersect(handleEndReached);

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
        {notifications.map((notification) => {
          if (!("id" in notification)) {
            return null;
          }

          const Component =
            notificationComponentMap[
              notification.__typename as keyof typeof notificationComponentMap
            ];

          return (
            <div
              className={cn({
                "p-5": notification.__typename !== "FollowNotification"
              })}
              key={notification.id}
            >
              {Component && <Component notification={notification as never} />}
            </div>
          );
        })}
        {hasMore && <span ref={loadMoreRef} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default memo(List);
