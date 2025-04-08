import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import { PageLayout } from "../Shared/PageLayout";
import Sidebar from "../Shared/Sidebar";

const GroupPageShimmer = () => {
  return (
    <PageLayout sidebar={<Sidebar />} sidebarPosition="right" showSearch>
      <div className="container mx-auto">
        <div className="shimmer h-52 sm:h-64 md:rounded-2xl" />
      </div>
      <div className="mb-4 space-y-9 px-5 md:px-0">
        <div className="-mt-24 sm:-mt-24 relative ml-5 size-32 bg-gray-100 sm:size-36">
          <div className="shimmer size-32 rounded-xl ring-3 ring-gray-50 sm:size-36 dark:bg-gray-700 dark:ring-black" />
        </div>
        <div className="space-y-3">
          <div className="shimmer h-5 w-1/3 rounded-lg" />
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="shimmer h-3 w-7/12 rounded-lg" />
            <div className="shimmer h-3 w-1/3 rounded-lg" />
          </div>
          <div className="space-y-2 pb-1">
            <div className="shimmer size-7 rounded-lg" />
            <div className="shimmer h-3 w-20 rounded-lg" />
          </div>
          <div className="shimmer h-[34px] w-20 rounded-full" />
        </div>
      </div>
      <PostsShimmer />
    </PageLayout>
  );
};

export default GroupPageShimmer;
