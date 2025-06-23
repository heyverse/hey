import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import {
  type MainContentFocus,
  PageSize,
  type PostsExploreRequest,
  usePostsExploreQuery
} from "@hey/indexer";
import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";

interface ExploreFeedProps {
  focus?: MainContentFocus;
}

const ExploreFeed = ({ focus }: ExploreFeedProps) => {
  const request: PostsExploreRequest = {
    filter: {
      metadata: { ...(focus && { mainContentFocus: [focus] }) }
    },
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = usePostsExploreQuery({
    variables: { request }
  });

  const posts = data?.mlPostsExplore?.items;
  const pageInfo = data?.mlPostsExplore?.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  const filteredPosts = (posts ?? []).filter(
    (post) =>
      !post.author.operations?.hasBlockedMe &&
      !post.author.operations?.isBlockedByMe &&
      !post.operations?.hasReported
  );

  return (
    <PostFeed
      emptyIcon={<ChatBubbleBottomCenterIcon className="size-8" />}
      emptyMessage="No posts yet!"
      error={error}
      errorTitle="Failed to load explore feed"
      handleEndReached={handleEndReached}
      hasMore={hasMore}
      items={filteredPosts}
      loading={loading}
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default ExploreFeed;
