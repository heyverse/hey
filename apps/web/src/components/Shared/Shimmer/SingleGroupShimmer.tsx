import cn from "@hey/ui/cn";
import type { FC } from "react";

interface SingleGroupShimmerProps {
  className?: string;
  isBig?: boolean;
  showJoinLeaveButton?: boolean;
}

const SingleGroupShimmer: FC<SingleGroupShimmerProps> = ({
  className = "",
  isBig = false,
  showJoinLeaveButton = false
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center space-x-3">
        <div
          className={cn(isBig ? "size-14" : "size-11", "shimmer rounded-lg")}
        />
        <div className="space-y-4 py-1">
          <div className="shimmer h-3 w-28 rounded-lg" />
          <div className="shimmer h-3 w-20 rounded-lg" />
          {isBig ? <div className="shimmer h-3 w-48 rounded-lg" /> : null}
        </div>
      </div>
      {showJoinLeaveButton ? (
        <div className="shimmer h-[26px] w-[68px] rounded-full" />
      ) : null}
    </div>
  );
};

export default SingleGroupShimmer;
