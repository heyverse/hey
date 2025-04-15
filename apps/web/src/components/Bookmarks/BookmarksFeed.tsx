import SinglePost from "@/components/Post/SinglePost";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import {
  type MainContentFocus,
  PageSize,
  type PostBookmarksRequest,
  usePostBookmarksQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { WindowVirtualizer } from "virtua";

interface BookmarksFeedProps {
  focus?: MainContentFocus;
}

const BookmarksFeed = ({ focus }: BookmarksFeedProps) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

  const request: PostBookmarksRequest = {
    pageSize: PageSize.Fifty,
    ...(focus && { filter: { metadata: { mainContentFocus: [focus] } } })
  };

  const { data, error, fetchMore, loading } = usePostBookmarksQuery({
    variables: { request }
  });

  const posts = data?.postBookmarks?.items;
  const pageInfo = data?.postBookmarks?.pageInfo;
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
        icon={<BookmarkIcon className="size-8" />}
        message="No bookmarks yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load bookmark feed" />;
  }

  return (
    <Card className="virtual-divider-list-window">
      <WindowVirtualizer>
        {posts.map((post, index) => (
          <SinglePost
            key={post.id}
            isFirst={index === 0}
            isLast={index === (posts?.length || 0) - 1}
            post={post}
          />
        ))}
        {hasMore && <span ref={ref} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default BookmarksFeed;
