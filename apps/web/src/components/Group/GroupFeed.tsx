import SinglePost from "@/components/Post/SinglePost";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostFragment,
  type PostsRequest,
  usePostsQuery
} from "@hey/indexer";
import { WindowVirtualizer } from "virtua";

interface GroupFeedProps {
  feed: string;
}

const GroupFeed = ({ feed }: GroupFeedProps) => {
  const request: PostsRequest = {
    filter: { feeds: [{ feed }] },
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = usePostsQuery({
    skip: !feed,
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
  const loadMoreRef = useLoadMoreOnIntersect(onEndReached);

  if (loading) {
    return <PostsShimmer />;
  }

  if (!posts?.length) {
    return (
      <EmptyState
        icon={<ChatBubbleBottomCenterIcon className="size-8" />}
        message="Group has no posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load group feed" />;
  }

  const filteredPosts = posts.filter(
    (post) =>
      !post.author.operations?.hasBlockedMe &&
      !post.author.operations?.isBlockedByMe &&
      !post.operations?.hasReported
  );

  return (
    <Card className="virtual-divider-list-window">
      <WindowVirtualizer>
        {filteredPosts.map((post) => (
          <SinglePost key={post.id} post={post} />
        ))}
        {hasMore && <span ref={loadMoreRef} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default GroupFeed;
