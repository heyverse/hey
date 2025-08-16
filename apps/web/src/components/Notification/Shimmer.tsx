import Skeleton from "@/components/Shared/Skeleton";

const NotificationShimmer = () => {
  return (
    <div className="flex items-start justify-between p-5">
      <div className="w-4/5 space-y-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="size-6 rounded-lg" />
          <Skeleton className="size-8 rounded-full" />
        </div>
        <div className="ml-9 space-y-2.5">
          <Skeleton className="h-3 w-4/5 rounded-lg" />
          <Skeleton className="h-3 w-3/5 rounded-lg" />
        </div>
      </div>
      <div className="text-[12px] text-gray-400">
        <Skeleton className="h-3 w-16 rounded-lg" />
      </div>
    </div>
  );
};

export default NotificationShimmer;
