import SinglePost from "@/components/Post/SinglePost";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostsForYouRequest,
  usePostsForYouQuery
} from "@hey/indexer";
import { WindowVirtualizer } from "virtua";

const ForYou = () => {
  const { currentAccount } = useAccountStore();

  const request: PostsForYouRequest = {
    pageSize: PageSize.Fifty,
    account: currentAccount?.address,
    shuffle: true
  };

  const { data, error, fetchMore, loading } = usePostsForYouQuery({
    variables: { request }
  });

  const posts = data?.mlPostsForYou.items;
  const pageInfo = data?.mlPostsForYou.pageInfo;
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
        icon={<LightBulbIcon className="size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load highlights" />;
  }

  const filteredPosts = posts.filter(
    (item) =>
      !item.post.author.operations?.hasBlockedMe &&
      !item.post.author.operations?.isBlockedByMe &&
      !item.post.operations?.hasReported
  );

  return (
    <Card className="virtual-divider-list-window">
      <WindowVirtualizer>
        {filteredPosts.map((item) => (
          <SinglePost key={item.post.id} post={item.post} />
        ))}
        {hasMore && <span ref={loadMoreRef} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default ForYou;
