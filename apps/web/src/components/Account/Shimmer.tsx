import { PageLayout } from "@/components/Shared/PageLayout";
import GraphStatsShimmer from "@/components/Shared/Shimmer/GraphStatsShimmer";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import FollowersYouKnowShimmer from "../Shared/Shimmer/FollowersYouKnowShimmer";

const AccountPageShimmer = () => {
  return (
    <PageLayout zeroTopMargin>
      <div className="mx-auto">
        <div className="shimmer h-52 sm:h-64 md:rounded-xl" />
      </div>
      <div className="mb-4 space-y-8 px-5 md:px-0">
        <div className="flex items-start justify-between">
          <div className="-mt-14 sm:-mt-24 relative ml-5 size-32 rounded-full bg-gray-100 sm:size-36">
            <div className="shimmer size-32 rounded-full ring-3 ring-gray-50 sm:size-36 dark:bg-gray-700 dark:ring-black" />
          </div>
          <div className="flex gap-2">
            <div className="shimmer h-[34px] w-20 rounded-full" />
            <div className="shimmer size-[34px] rounded-full" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="shimmer h-5 w-1/3 rounded-lg" />
          <div className="shimmer h-3 w-1/4 rounded-lg" />
        </div>
        <div className="space-y-5">
          <div className="shimmer h-3 w-7/12 rounded-lg" />
          <GraphStatsShimmer count={2} />
          <FollowersYouKnowShimmer />
          <GraphStatsShimmer count={2} />
        </div>
      </div>
      <div className="mt-3 mb-5 flex gap-3 px-5 sm:mt-0 sm:px-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="shimmer h-8 w-14 rounded-lg sm:w-18" key={index} />
        ))}
      </div>
      <PostsShimmer />
    </PageLayout>
  );
};

export default AccountPageShimmer;
