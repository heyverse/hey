import SinglePost from "@/components/Post/SinglePost";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostFragment,
  type PostsForYouRequest,
  usePostsForYouQuery
} from "@hey/indexer";
import PostFeed from "../Shared/Post/PostFeed";

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
      items={filteredPosts as PostFragment[]}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onEndReached={onEndReached}
      emptyIcon={<LightBulbIcon className="size-8" />}
      emptyMessage="No posts yet!"
      errorTitle="Failed to load for you"
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default ForYou;
