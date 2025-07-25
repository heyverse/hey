import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { PageSize, type PostsRequest, usePostsQuery } from "@hey/indexer";
import { useCallback, useMemo } from "react";
import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";

interface GroupFeedProps {
  feed: string;
}

const GroupFeed = ({ feed }: GroupFeedProps) => {
  const request: PostsRequest = {
    filter: { feeds: [{ feed }] },
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = usePostsQuery({
    skip: !feed,
    variables: { request }
  });

  const posts = data?.posts?.items;
  const pageInfo = data?.posts?.pageInfo;
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
          !post.author.operations?.isBlockedByMe
      ),
    [posts]
  );

  return (
    <PostFeed
      emptyIcon={<ChatBubbleBottomCenterIcon className="size-8" />}
      emptyMessage="Group has no posts yet!"
      error={error}
      errorTitle="Failed to load group feed"
      handleEndReached={handleEndReached}
      hasMore={hasMore}
      items={filteredPosts}
      loading={loading}
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default GroupFeed;
