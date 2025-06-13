import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import type { ReactNode } from "react";
import { WindowVirtualizer } from "virtua";

interface PostFeedProps<T extends { id: string }> {
  items: T[];
  loading?: boolean;
  error?: unknown;
  hasMore?: boolean;
  onEndReached: () => Promise<void>;
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
  onEndReached,
  emptyIcon,
  emptyMessage,
  errorTitle,
  renderItem
}: PostFeedProps<T>) => {
  const loadMoreRef = useLoadMoreOnIntersect(onEndReached);

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
    <Card className="virtual-divider-list-window">
      <WindowVirtualizer>
        {items.map((item) => renderItem(item))}
        {hasMore && <span ref={loadMoreRef} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default PostFeed;
