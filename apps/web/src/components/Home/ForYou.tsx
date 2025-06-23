import { LightBulbIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostFragment,
  type PostsForYouRequest,
  usePostsForYouQuery
} from "@hey/indexer";
import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const ForYou = () => {
  const { currentAccount } = useAccountStore();

  const request: PostsForYouRequest = {
    account: currentAccount?.address,
    pageSize: PageSize.Fifty,
    shuffle: true
  };

  const { data, error, fetchMore, loading } = usePostsForYouQuery({
    variables: { request }
  });

  const posts = data?.mlPostsForYou.items;
  const pageInfo = data?.mlPostsForYou.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  const filteredPosts = posts
    ?.map((item) => item.post)
    .filter(
      (post) =>
        !post.author.operations?.hasBlockedMe &&
        !post.author.operations?.isBlockedByMe &&
        !post.operations?.hasReported
    );

  return (
    <PostFeed
      emptyIcon={<LightBulbIcon className="size-8" />}
      emptyMessage="No posts yet!"
      error={error}
      errorTitle="Failed to load for you"
      handleEndReached={handleEndReached}
      hasMore={hasMore}
      items={filteredPosts as PostFragment[]}
      loading={loading}
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default ForYou;
