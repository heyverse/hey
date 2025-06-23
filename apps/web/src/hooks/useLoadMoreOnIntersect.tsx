import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";

const useLoadMoreOnIntersect = (onLoadMore: () => void) => {
  const [ref, entry] = useIntersectionObserver({
    root: null,
    rootMargin: "0px",
    threshold: 0
  });

  const wasIntersecting = useRef(false);

  useEffect(() => {
    const isIntersecting = entry?.isIntersecting ?? false;

    if (isIntersecting && !wasIntersecting.current) {
      onLoadMore();
    }

    wasIntersecting.current = isIntersecting;
  }, [entry?.isIntersecting, onLoadMore]);

  return ref;
};

export default useLoadMoreOnIntersect;
