import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useCallback, useEffect, useRef } from "react";

const useLoadMoreOnIntersect = (onLoadMore: () => void) => {
  const [ref, entry] = useIntersectionObserver({
    root: null,
    rootMargin: "0px",
    threshold: 0
  });

  const wasIntersecting = useRef(false);
  const memoizedOnLoadMore = useCallback(onLoadMore, [onLoadMore]);

  useEffect(() => {
    const isIntersecting = entry?.isIntersecting ?? false;

    if (isIntersecting && !wasIntersecting.current) {
      memoizedOnLoadMore();
    }

    wasIntersecting.current = isIntersecting;
  }, [entry?.isIntersecting, memoizedOnLoadMore]);

  return ref;
};

export default useLoadMoreOnIntersect;
