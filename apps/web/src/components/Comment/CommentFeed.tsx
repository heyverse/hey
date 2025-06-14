import { useHiddenCommentFeedStore } from "@/components/Post";
import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  PostReferenceType,
  type PostReferencesRequest,
  PostVisibilityFilter,
  ReferenceRelevancyFilter,
  type ReferencedPostFragment,
  usePostReferencesQuery
} from "@hey/indexer";

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

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  const filteredComments = comments.filter(
    (comment) =>
      !comment.author.operations?.hasBlockedMe &&
      !comment.author.operations?.isBlockedByMe &&
      !comment.operations?.hasReported &&
      !comment.isDeleted
  );

  return (
    <PostFeed
      items={filteredComments}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onEndReached={onEndReached}
      emptyIcon={<ChatBubbleLeftIcon className="size-8" />}
      emptyMessage="Be the first one to comment!"
      errorTitle="Failed to load comment feed"
      renderItem={(comment) => (
        <SinglePost key={comment.id} post={comment} showType={false} />
      )}
    />
  );
};

export default CommentFeed;
