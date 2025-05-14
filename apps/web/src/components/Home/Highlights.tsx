import SinglePost from "@/components/Post/SinglePost";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type TimelineHighlightsRequest,
  useTimelineHighlightsQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { WindowVirtualizer } from "virtua";

const Highlights = () => {
  const { currentAccount } = useAccountStore();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

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

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  useEffect(() => {
    if (entry?.isIntersecting) {
      onEndReached();
    }
  }, [entry?.isIntersecting]);

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
        {hasMore && <span ref={ref} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default Highlights;
