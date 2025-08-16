import cn from "@/helpers/cn";

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => {
  return <div className={cn("shimmer", className)} />;
};

export default Skeleton;
