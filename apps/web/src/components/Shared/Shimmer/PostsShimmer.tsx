import { Card } from "@/components/Shared/UI";
import PostShimmer from "./PostShimmer";

const PostsShimmer = () => {
  return (
    <Card className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 3 }).map((_, index) => (
        <PostShimmer key={index} />
      ))}
    </Card>
  );
};

export default PostsShimmer;
