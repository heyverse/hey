import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import type {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  Ref,
  SyntheticEvent
} from "react";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";

const Image = forwardRef(
  (
    {
      onError,
      ...props
    }: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    ref: Ref<HTMLImageElement>
  ) => {
    const [imageLoadFailed, setImageLoadFailed] = useState(false);

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

    return (
      <img
        {...props}
        alt={props.alt || ""}
        onError={handleError}
        ref={ref}
        src={imageLoadFailed ? PLACEHOLDER_IMAGE : props.src}
      />
    );
  }
);

export default memo(Image);
