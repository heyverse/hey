import { memo } from "react";
import Skeleton from "@/components/Shared/Skeleton";

const PostShimmer = () => {
  return (
    <div className="flex items-start space-x-3 px-5 py-4">
      <div>
        <Skeleton className="size-11 rounded-full" />
      </div>
      <div className="w-full space-y-4">
        <div className="item flex justify-between">
          <div className="item flex space-x-3 pt-1">
            <Skeleton className="h-3 w-28 rounded-lg" />
            <Skeleton className="h-3 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-3 w-6 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-7/12 rounded-lg" />
          <Skeleton className="h-3 w-1/3 rounded-lg" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-6 pt-1">
            <Skeleton className="size-5 rounded-lg" />
            <Skeleton className="size-5 rounded-lg" />
            <Skeleton className="size-5 rounded-lg" />
            <Skeleton className="size-5 rounded-lg" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default memo(PostShimmer);
