import SinglePost from "@/components/Post/SinglePost";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostFragment,
  type PostsRequest,
  usePostsQuery
} from "@hey/indexer";
import PostFeed from "../Shared/Post/PostFeed";

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

  const posts = data?.posts?.items as PostFragment[];
  const pageInfo = data?.posts?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  return (
    <PostFeed
      items={posts}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onEndReached={onEndReached}
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
