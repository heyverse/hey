import GraphStatsShimmer from "@/components/Shared/Shimmer/GraphStatsShimmer";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import Sidebar from "../Home/Sidebar";
import { GeneralPageLayout } from "../Shared/PageLayout";

const AccountPageShimmer = () => {
  return (
    <GeneralPageLayout sidebar={<Sidebar />}>
      <div className="container mx-auto">
        <div className="shimmer h-52 sm:h-64 md:rounded-2xl" />
      </div>
      <div className="mb-4 space-y-9 px-5 md:px-0">
        <div className="-mt-14 sm:-mt-24 relative ml-5 size-32 rounded-full bg-neutral-100 sm:size-36">
          <div className="shimmer size-32 rounded-full ring-3 ring-neutral-50 sm:size-36 dark:bg-neutral-700 dark:ring-black" />
        </div>
        <div className="space-y-3">
          <div className="shimmer h-5 w-1/3 rounded-lg" />
          <div className="shimmer h-3 w-1/4 rounded-lg" />
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="shimmer h-3 w-7/12 rounded-lg" />
            <div className="shimmer h-3 w-1/3 rounded-lg" />
          </div>
          <GraphStatsShimmer count={2} />
          <div className="shimmer h-[34px] w-20 rounded-full" />
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div className="flex items-center space-x-2" key={index}>
                <div className="shimmer size-4 rounded-lg" />
                <div className="shimmer h-3 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 mb-5 flex gap-3 px-5 sm:mt-0 sm:px-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="shimmer h-8 w-14 rounded-lg sm:w-28" key={index} />
        ))}
      </div>
      <PostsShimmer />
    </GeneralPageLayout>
  );
};

export default AccountPageShimmer;
