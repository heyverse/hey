import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useCallback, useEffect, useRef } from "react";

const useLoadMoreOnIntersect = (onLoadMore: () => void) => {
  const [ref, entry] = useIntersectionObserver({
    root: null,
    rootMargin: "100px", // Load more when 100px away from element
    threshold: 0
  });

  const wasIntersecting = useRef(false);
  const isLoadingMore = useRef(false);

  const memoizedOnLoadMore = useCallback(async () => {
    if (isLoadingMore.current) return;

    isLoadingMore.current = true;
    try {
      await onLoadMore();
    } finally {
      isLoadingMore.current = false;
    }
  }, [onLoadMore]);

  useEffect(() => {
    const isIntersecting = entry?.isIntersecting ?? false;

    if (isIntersecting && !wasIntersecting.current && !isLoadingMore.current) {
      memoizedOnLoadMore();
    }

    wasIntersecting.current = isIntersecting;
  }, [entry?.isIntersecting, memoizedOnLoadMore]);

  return ref;
};

export default useLoadMoreOnIntersect;
