import { Card } from "@/components/Shared/UI";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import PostShimmer from "./PostShimmer";

const PostListShimmer = () => {
  return (
    <Card className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="flex items-center space-x-3 px-5 py-6">
        <ArrowLeftIcon className="size-5" />
        <div className="shimmer h-4 w-1/5 rounded-full" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <PostShimmer key={index} />
      ))}
    </Card>
  );
};

export default PostListShimmer;
