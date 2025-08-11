import Skeleton from "@/components/Shared/Skeleton";
import { memo } from "react";

const FollowersYouKnowShimmer = () => {
  return (
    <div className="flex items-center gap-x-2">
      <div className="-space-x-2 flex">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton className="size-5 rounded-full" key={index} />
        ))}
      </div>
      <Skeleton className="h-3 w-1/5 rounded-lg" />
    </div>
  );
};

export default memo(FollowersYouKnowShimmer);
