import cn from "@/helpers/cn";
import Skeleton from "../Skeleton";

interface SmallSingleAccountShimmerProps {
  hideSlug?: boolean;
  smallAvatar?: boolean;
}

const SmallSingleAccountShimmer = ({
  hideSlug = false,
  smallAvatar = false
}: SmallSingleAccountShimmerProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton
        className={cn(smallAvatar ? "size-4" : "size-6", "rounded-full")}
      />
      <Skeleton className="h-3 w-28 rounded-lg" />
      {!hideSlug && <Skeleton className="h-3 w-20 rounded-lg" />}
    </div>
  );
};

export default SmallSingleAccountShimmer;
