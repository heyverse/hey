import SinglePost from "@/components/Post/SinglePost";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type TimelineHighlightsRequest,
  useTimelineHighlightsQuery
} from "@hey/indexer";
import PostFeed from "../Shared/Post/PostFeed";

const Highlights = () => {
  const { currentAccount } = useAccountStore();

  const request: TimelineHighlightsRequest = {
    pageSize: PageSize.Fifty,
    account: currentAccount?.address
  };

  const { data, error, fetchMore, loading } = useTimelineHighlightsQuery({
    variables: { request }
  });

  const posts = data?.timelineHighlights.items;
  const pageInfo = data?.timelineHighlights.pageInfo;
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
      items={filteredPosts}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onEndReached={handleEndReached}
      emptyIcon={<LightBulbIcon className="size-8" />}
      emptyMessage="No posts yet!"
      errorTitle="Failed to load highlights"
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default Highlights;
