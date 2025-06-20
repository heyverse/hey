import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { PageSize, type PostsRequest, usePostsQuery } from "@hey/indexer";

interface PostsProps {
  query: string;
}

const Posts = ({ query }: PostsProps) => {
  const request: PostsRequest = {
    pageSize: PageSize.Fifty,
    filter: { searchQuery: query }
  };

  const { data, error, fetchMore, loading } = usePostsQuery({
    variables: { request }
  });

  const posts = data?.posts?.items;
  const pageInfo = data?.posts?.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  return (
    <PostFeed
      items={posts ?? []}
      loading={loading}
      error={error}
      hasMore={hasMore}
      handleEndReached={handleEndReached}
      emptyIcon={<ChatBubbleBottomCenterIcon className="size-8" />}
      emptyMessage={
        <span>
          No posts for <b>&ldquo;{query}&rdquo;</b>
        </span>
      }
      errorTitle="Failed to load posts"
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default Posts;
