import type { ReactNode } from "react";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import {
  Card,
  EmptyState,
  ErrorMessage,
  VirtualList
} from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";

interface PostFeedProps<T extends { id: string }> {
  items: T[];
  loading?: boolean;
  error?: unknown;
  hasMore?: boolean;
  handleEndReached: () => Promise<void>;
  emptyIcon: ReactNode;
  emptyMessage: ReactNode;
  errorTitle: string;
  renderItem: (item: T) => ReactNode;
}

const PostFeed = <T extends { id: string }>({
  items,
  loading = false,
  error,
  hasMore,
  handleEndReached,
  emptyIcon,
  emptyMessage,
  errorTitle,
  renderItem
}: PostFeedProps<T>) => {
  const loadMoreRef = useLoadMoreOnIntersect(handleEndReached);

  if (loading) {
    return <PostsShimmer />;
  }

  if (!items?.length) {
    return <EmptyState icon={emptyIcon} message={emptyMessage} />;
  }

  if (error) {
    return <ErrorMessage error={error} title={errorTitle} />;
  }

  return (
    <Card>
      <VirtualList
        className="virtual-divider-list-window"
        estimatedItemSize={300}
        items={items}
        loadMoreRef={hasMore ? loadMoreRef : undefined}
        renderItem={(item) => renderItem(item)}
      />
    </Card>
  );
};

export default PostFeed;
