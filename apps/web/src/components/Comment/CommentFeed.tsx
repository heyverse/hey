import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostReferencesRequest,
  PostReferenceType,
  PostVisibilityFilter,
  type ReferencedPostFragment,
  ReferenceRelevancyFilter,
  usePostReferencesQuery
} from "@hey/indexer";
import { useCallback } from "react";
import { useHiddenCommentFeedStore } from "@/components/Post";
import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";

interface CommentFeedProps {
  postId: string;
}

const CommentFeed = ({ postId }: CommentFeedProps) => {
  const { showHiddenComments } = useHiddenCommentFeedStore();

  const request: PostReferencesRequest = {
    pageSize: PageSize.Fifty,
    referencedPost: postId,
    referenceTypes: [PostReferenceType.CommentOn],
    relevancyFilter: ReferenceRelevancyFilter.Relevant,
    visibilityFilter: showHiddenComments
      ? PostVisibilityFilter.Hidden
      : PostVisibilityFilter.Visible
  };

  const { data, error, fetchMore, loading } = usePostReferencesQuery({
    skip: !postId,
    variables: { request }
  });

  const comments =
    (data?.postReferences?.items as ReferencedPostFragment[]) ?? [];
  const pageInfo = data?.postReferences?.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = useCallback(async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  }, [fetchMore, hasMore, pageInfo?.next, request]);

  const filteredComments = comments.filter(
    (comment) =>
      !comment.author.operations?.hasBlockedMe &&
      !comment.author.operations?.isBlockedByMe &&
      !comment.operations?.hasReported &&
      !comment.isDeleted
  );

  return (
    <PostFeed
      emptyIcon={<ChatBubbleLeftIcon className="size-8" />}
      emptyMessage="Be the first one to comment!"
      error={error}
      errorTitle="Failed to load comment feed"
      handleEndReached={handleEndReached}
      hasMore={hasMore}
      items={filteredComments}
      loading={loading}
      renderItem={(comment) => (
        <SinglePost key={comment.id} post={comment} showType={false} />
      )}
    />
  );
};

export default CommentFeed;
