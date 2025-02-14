import { useHiddenCommentFeedStore } from "@components/Post";
import QueuedPost from "@components/Post/QueuedPost";
import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type Post,
  PostReferenceType,
  type PostReferencesRequest,
  PostVisibilityFilter,
  usePostReferencesQuery
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

interface CommentFeedProps {
  postId: string;
}

const CommentFeed: FC<CommentFeedProps> = ({ postId }) => {
  const { txnQueue } = useTransactionStore();
  const { showHiddenComments } = useHiddenCommentFeedStore();

  const request: PostReferencesRequest = {
    pageSize: PageSize.Fifty,
    referencedPost: postId,
    referenceTypes: [PostReferenceType.CommentOn],
    visibilityFilter: showHiddenComments
      ? PostVisibilityFilter.Hidden
      : PostVisibilityFilter.Visible
  };

  const { data, error, fetchMore, loading } = usePostReferencesQuery({
    skip: !postId,
    variables: { request }
  });

  const comments = data?.postReferences?.items ?? [];
  const pageInfo = data?.postReferences?.pageInfo;
  const hasMore = pageInfo?.next;

  const queuedComments = txnQueue.filter(
    (o) => o.type === OptimisticTxType.COMMENT && o.commentOn === postId
  );
  const queuedCount = queuedComments.length;
  const totalComments = comments?.length + queuedCount;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <PostsShimmer />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load comment feed" />;
  }

  if (totalComments === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleLeftIcon className="size-8" />}
        message="Be the first one to comment!"
      />
    );
  }

  return (
    <>
      {queuedComments.map((txn) => (
        <QueuedPost key={txn.txHash} txn={txn} />
      ))}
      <Card>
        <Virtuoso
          className="virtual-divider-list-window"
          computeItemKey={(index, comment) =>
            `${postId}-${comment.id}-${index}`
          }
          data={comments}
          endReached={onEndReached}
          itemContent={(index, comment) => {
            if (comment.isDeleted) {
              return null;
            }

            const isFirst = index === 0;
            const isLast = index === comments.length - 1;

            return (
              <SinglePost
                isFirst={isFirst}
                isLast={isLast}
                post={comment as Post}
                showType={false}
              />
            );
          }}
          useWindowScroll
        />
      </Card>
    </>
  );
};

export default CommentFeed;
