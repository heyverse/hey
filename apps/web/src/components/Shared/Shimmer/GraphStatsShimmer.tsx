import { memo } from "react";
import Skeleton from "@/components/Shared/Skeleton";

interface GraphStatsShimmerProps {
  count: number;
}

const GraphStatsShimmer = ({ count }: GraphStatsShimmerProps) => {
  return (
    <div className="flex gap-5 pb-1">
      {Array.from({ length: count }).map((_, index) => (
        <div className="flex items-center gap-x-2" key={index}>
          <Skeleton className="size-4 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default memo(GraphStatsShimmer);
