import { LightBulbIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type TimelineHighlightsRequest,
  useTimelineHighlightsQuery
} from "@hey/indexer";
import { useCallback, useMemo } from "react";
import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const Highlights = () => {
  const { currentAccount } = useAccountStore();

  const request: TimelineHighlightsRequest = {
    account: currentAccount?.address,
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = useTimelineHighlightsQuery({
    variables: { request }
  });

  const posts = data?.timelineHighlights.items;
  const pageInfo = data?.timelineHighlights.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = useCallback(async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  }, [fetchMore, hasMore, pageInfo?.next, request]);

  const filteredPosts = useMemo(
    () =>
      (posts ?? []).filter(
        (post) =>
          !post.author.operations?.hasBlockedMe &&
          !post.author.operations?.isBlockedByMe &&
          !post.operations?.hasReported
      ),
    [posts]
  );

  return (
    <PostFeed
      emptyIcon={<LightBulbIcon className="size-8" />}
      emptyMessage="No posts yet!"
      error={error}
      errorTitle="Failed to load highlights"
      handleEndReached={handleEndReached}
      hasMore={hasMore}
      items={filteredPosts}
      loading={loading}
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default Highlights;
