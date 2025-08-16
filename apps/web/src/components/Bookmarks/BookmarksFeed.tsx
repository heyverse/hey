import { BookmarkIcon } from "@heroicons/react/24/outline";
import {
  type MainContentFocus,
  PageSize,
  type PostBookmarksRequest,
  usePostBookmarksQuery
} from "@hey/indexer";
import { useCallback } from "react";
import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";

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

  const posts = data?.postBookmarks?.items ?? [];
  const pageInfo = data?.postBookmarks?.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = useCallback(async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  }, [fetchMore, hasMore, pageInfo?.next, request]);

  return (
    <PostFeed
      emptyIcon={<BookmarkIcon className="size-8" />}
      emptyMessage="No bookmarks yet!"
      error={error}
      errorTitle="Failed to load bookmark feed"
      handleEndReached={handleEndReached}
      hasMore={hasMore}
      items={posts}
      loading={loading}
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default BookmarksFeed;
