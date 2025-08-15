import { useCallback, useRef, useState } from "react";

interface UseLoadMoreOptions {
  hasMore: boolean;
  onLoadMore: () => Promise<void> | void;
}

const useLoadMore = ({ hasMore, onLoadMore }: UseLoadMoreOptions) => {
  const isFetchingRef = useRef(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const onEndReached = useCallback(async () => {
    if (!hasMore || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsFetchingMore(true);
    try {
      await onLoadMore();
    } finally {
      isFetchingRef.current = false;
      setIsFetchingMore(false);
    }
  }, [hasMore, onLoadMore]);

  return { isFetchingMore, onEndReached };
};

export default useLoadMore;
