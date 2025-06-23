import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";

const useLoadMoreOnIntersect = (onLoadMore: () => void) => {
  const [ref, entry] = useIntersectionObserver({
    root: null,
    rootMargin: "0px",
    threshold: 0
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      onLoadMore();
    }
  }, [entry?.isIntersecting, onLoadMore]);

  return ref;
};

export default useLoadMoreOnIntersect;
