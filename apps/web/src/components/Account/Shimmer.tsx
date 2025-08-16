import PageLayout from "@/components/Shared/PageLayout";
import FollowersYouKnowShimmer from "@/components/Shared/Shimmer/FollowersYouKnowShimmer";
import GraphStatsShimmer from "@/components/Shared/Shimmer/GraphStatsShimmer";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import Skeleton from "@/components/Shared/Skeleton";

const AccountPageShimmer = () => {
  return (
    <PageLayout zeroTopMargin>
      <div className="mx-auto">
        <Skeleton className="h-52 sm:h-64 md:rounded-xl" />
      </div>
      <div className="mb-4 space-y-8 px-5 md:px-0">
        <div className="flex items-start justify-between">
          <div className="-mt-14 sm:-mt-24 relative ml-5 size-32 rounded-full bg-gray-100 sm:size-36">
            <Skeleton className="size-32 rounded-full ring-3 ring-gray-50 sm:size-36 dark:bg-gray-700 dark:ring-black" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-[34px] w-20 rounded-full" />
            <Skeleton className="size-[34px] rounded-full" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-1/3 rounded-lg" />
          <Skeleton className="h-3 w-1/4 rounded-lg" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-3 w-7/12 rounded-lg" />
          <GraphStatsShimmer count={2} />
          <FollowersYouKnowShimmer />
          <GraphStatsShimmer count={2} />
        </div>
      </div>
      <div className="mt-3 mb-5 flex gap-3 px-5 sm:mt-0 sm:px-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-8 w-14 rounded-lg sm:w-18" key={index} />
        ))}
      </div>
      <PostsShimmer />
    </PageLayout>
  );
};

export default AccountPageShimmer;
