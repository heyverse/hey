import { memo, useMemo } from "react";
import { THUMBNAIL_GENERATE_COUNT } from "@/components/Composer/ChooseThumbnail";
import Skeleton from "@/components/Shared/Skeleton";

const ThumbnailsShimmer = () => {
  const thumbnails = useMemo(() => Array(THUMBNAIL_GENERATE_COUNT).fill(1), []);

  return (
    <>
      {thumbnails.map((e, i) => (
        <Skeleton className="rounded-lg" key={`${e}_${i}`} />
      ))}
    </>
  );
};

export default memo(ThumbnailsShimmer);
