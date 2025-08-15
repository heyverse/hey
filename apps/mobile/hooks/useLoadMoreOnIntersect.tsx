import { useCallback, useRef, useState } from "react";

interface UseLoadMoreOnIntersectOptions {
  hasMore: boolean;
  onLoadMore: () => Promise<void> | void;
}

interface UseLoadMoreOnIntersectResult {
  onEndReached: () => Promise<void> | void;
  onMomentumScrollBegin: () => void;
  onScrollBeginDrag: () => void;
  isFetchingMore: boolean;
}

// React Native version: guards FlatList onEndReached to avoid eager firing
const useLoadMoreOnIntersect = (
  options: UseLoadMoreOnIntersectOptions
): UseLoadMoreOnIntersectResult => {
  const { hasMore, onLoadMore } = options;
  const isFetchingMoreRef = useRef(false);
  const hasStartedScrollingRef = useRef(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const onMomentumScrollBegin = useCallback(() => {
    hasStartedScrollingRef.current = true;
  }, []);

  const onScrollBeginDrag = useCallback(() => {
    hasStartedScrollingRef.current = true;
  }, []);

  const onEndReached = useCallback(async () => {
    if (!hasMore) return;
    if (!hasStartedScrollingRef.current) return;
    if (isFetchingMoreRef.current) return;

    isFetchingMoreRef.current = true;
    setIsFetchingMore(true);
    try {
      await onLoadMore();
    } finally {
      isFetchingMoreRef.current = false;
      setIsFetchingMore(false);
    }
  }, [hasMore, onLoadMore]);

  return {
    isFetchingMore,
    onEndReached,
    onMomentumScrollBegin,
    onScrollBeginDrag
  };
};

export default useLoadMoreOnIntersect;
