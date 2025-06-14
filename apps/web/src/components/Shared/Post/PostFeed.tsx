import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { useFeedCacheStore } from "@/store/non-persisted/feed/useFeedCacheStore";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { WindowVirtualizer, type WindowVirtualizerHandle } from "virtua";

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
  const { pathname } = useLocation();
  const { getCache, setCache } = useFeedCacheStore();
  const cache = getCache(pathname);
  const virtualizerRef = useRef<WindowVirtualizerHandle>(null);

  useEffect(() => {
    return () => {
      if (virtualizerRef.current) {
        setCache(pathname, virtualizerRef.current.cache);
      }
    };
  }, [pathname, setCache]);

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
      <WindowVirtualizer ref={virtualizerRef} cache={cache}>
        {items.map((item) => renderItem(item))}
        {hasMore && <span ref={loadMoreRef} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default PostFeed;
