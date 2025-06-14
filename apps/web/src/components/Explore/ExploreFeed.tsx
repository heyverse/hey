import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import {
  type MainContentFocus,
  PageSize,
  type PostsExploreRequest,
  usePostsExploreQuery
} from "@hey/indexer";

interface ExploreFeedProps {
  focus?: MainContentFocus;
}

const ExploreFeed = ({ focus }: ExploreFeedProps) => {
  const request: PostsExploreRequest = {
    pageSize: PageSize.Fifty,
    filter: {
      metadata: { ...(focus && { mainContentFocus: [focus] }) }
    }
  };

  const { data, error, fetchMore, loading } = usePostsExploreQuery({
    variables: { request }
  });

  const posts = data?.mlPostsExplore?.items;
  const pageInfo = data?.mlPostsExplore?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
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
      items={filteredPosts}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onEndReached={onEndReached}
      emptyIcon={<ChatBubbleBottomCenterIcon className="size-8" />}
      emptyMessage="No posts yet!"
      errorTitle="Failed to load explore feed"
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default ExploreFeed;
