import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import type {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  Ref,
  SyntheticEvent
} from "react";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";

interface ImageProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  enableLazyLoading?: boolean;
}

const Image = forwardRef(
  (
    { onError, enableLazyLoading = true, ...props }: ImageProps,
    ref: Ref<HTMLImageElement>
  ) => {
    const [imageLoadFailed, setImageLoadFailed] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(!enableLazyLoading);

    const [intersectionRef, entry] = useIntersectionObserver({
      rootMargin: "50px",
      threshold: 0
    });

    const handleError = useCallback(
      (event: SyntheticEvent<HTMLImageElement, Event>) => {
        if (imageLoadFailed) {
          return;
        }
        setImageLoadFailed(true);
        if (onError) {
          onError(event);
        }
      },
      [imageLoadFailed, setImageLoadFailed, onError]
    );

    useEffect(() => {
      setImageLoadFailed(false);
    }, [props.src]);

    useEffect(() => {
      if (enableLazyLoading && entry?.isIntersecting && !shouldLoad) {
        setShouldLoad(true);
      }
    }, [entry?.isIntersecting, enableLazyLoading, shouldLoad]);

    // Combine refs for intersection observer and forwarded ref
    const combinedRef = useCallback(
      (node: HTMLImageElement) => {
        if (enableLazyLoading) {
          intersectionRef(node);
        }
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [intersectionRef, ref, enableLazyLoading]
    );

    return (
      <img
        {...props}
        alt={props.alt || ""}
        loading={enableLazyLoading ? "lazy" : "eager"}
        onError={handleError}
        ref={combinedRef}
        src={
          shouldLoad
            ? imageLoadFailed
              ? PLACEHOLDER_IMAGE
              : props.src
            : PLACEHOLDER_IMAGE
        }
      />
    );
  }
);

export default memo(Image);
