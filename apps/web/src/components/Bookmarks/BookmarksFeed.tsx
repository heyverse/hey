import SinglePost from "@/components/Post/SinglePost";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import {
  type MainContentFocus,
  PageSize,
  type PostBookmarksRequest,
  usePostBookmarksQuery
} from "@hey/indexer";
import { WindowVirtualizer } from "virtua";

interface BookmarksFeedProps {
  focus?: MainContentFocus;
}

const BookmarksFeed = ({ focus }: BookmarksFeedProps) => {
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
  const loadMoreRef = useLoadMoreOnIntersect(onEndReached);

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
        {posts.map((post) => (
          <SinglePost key={post.id} post={post} />
        ))}
        {hasMore && <span ref={loadMoreRef} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default BookmarksFeed;
