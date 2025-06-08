import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";

const useLoadMoreOnIntersect = (onLoadMore: () => void) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      onLoadMore();
    }
  }, [entry?.isIntersecting, onLoadMore]);

  return ref;
};

export default useLoadMoreOnIntersect;
