import { memo } from "react";
import Skeleton from "@/components/Shared/Skeleton";
import cn from "@/helpers/cn";

interface SingleGroupShimmerProps {
  className?: string;
  isBig?: boolean;
  showJoinLeaveButton?: boolean;
}

const SingleGroupShimmer = ({
  className = "",
  isBig = false,
  showJoinLeaveButton = false
}: SingleGroupShimmerProps) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center space-x-3">
        <Skeleton className={cn(isBig ? "size-14" : "size-11", "rounded-lg")} />
        <div className="space-y-4 py-1">
          <Skeleton className="h-3 w-28 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-lg" />
          {isBig ? <Skeleton className="h-3 w-48 rounded-lg" /> : null}
        </div>
      </div>
      {showJoinLeaveButton ? (
        <Skeleton className="h-[26px] w-[68px] rounded-full" />
      ) : null}
    </div>
  );
};

export default memo(SingleGroupShimmer);
