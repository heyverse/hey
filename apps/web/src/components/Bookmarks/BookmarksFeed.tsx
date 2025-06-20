import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import {
  type MainContentFocus,
  PageSize,
  type PostBookmarksRequest,
  usePostBookmarksQuery
} from "@hey/indexer";

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

  const handleEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };
  return (
    <PostFeed
      items={posts}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onEndReached={handleEndReached}
      emptyIcon={<BookmarkIcon className="size-8" />}
      emptyMessage="No bookmarks yet!"
      errorTitle="Failed to load bookmark feed"
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default BookmarksFeed;
