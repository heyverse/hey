import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { TRANSFORMS } from "@hey/data/constants";
import getAvatar from "@hey/helpers/getAvatar";
import {
  PageSize,
  type PostReferencesRequest,
  PostReferenceType,
  PostVisibilityFilter,
  type ReferencedPostFragment,
  ReferenceRelevancyFilter,
  usePostReferencesQuery
} from "@hey/indexer";
import { useState } from "react";
import { useHiddenCommentFeedStore } from "@/components/Post";
import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";
import { Card, StackedAvatars } from "@/components/Shared/UI";

interface NoneRelevantFeedProps {
  postId: string;
}

const NoneRelevantFeed = ({ postId }: NoneRelevantFeedProps) => {
  const { showHiddenComments } = useHiddenCommentFeedStore();
  const [showMore, setShowMore] = useState(false);

  const request: PostReferencesRequest = {
    pageSize: PageSize.Fifty,
    referencedPost: postId,
    referenceTypes: [PostReferenceType.CommentOn],
    relevancyFilter: ReferenceRelevancyFilter.NotRelevant,
    visibilityFilter: showHiddenComments
      ? PostVisibilityFilter.Hidden
      : PostVisibilityFilter.Visible
  };

  const { data, fetchMore } = usePostReferencesQuery({
    skip: !postId,
    variables: { request }
  });

  const comments =
    (data?.postReferences?.items as ReferencedPostFragment[]) ?? [];
  const pageInfo = data?.postReferences?.pageInfo;
  const hasMore = pageInfo?.next;
  const totalComments = comments?.length;

  const handleEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (totalComments === 0) {
    return null;
  }

  const filteredComments = comments.filter(
    (comment) =>
      !comment.author.operations?.hasBlockedMe &&
      !comment.author.operations?.isBlockedByMe &&
      !comment.operations?.hasReported &&
      !comment.isDeleted
  );

  return (
    <>
      <Card
        className="flex cursor-pointer items-center justify-center space-x-2.5 p-5"
        onClick={() => setShowMore(!showMore)}
      >
        <StackedAvatars
          avatars={filteredComments.map((comment) =>
            getAvatar(comment.author, TRANSFORMS.AVATAR_TINY)
          )}
          limit={5}
        />
        <div>{showMore ? "Hide more comments" : "Show more comments"}</div>
        {showMore ? (
          <ChevronUpIcon className="size-4" />
        ) : (
          <ChevronDownIcon className="size-4" />
        )}
      </Card>
      {showMore ? (
        <PostFeed
          emptyIcon={null}
          emptyMessage=""
          errorTitle="Failed to load comments"
          handleEndReached={handleEndReached}
          hasMore={hasMore}
          items={filteredComments}
          renderItem={(comment) => (
            <SinglePost key={comment.id} post={comment} showType={false} />
          )}
        />
      ) : null}
    </>
  );
};

export default NoneRelevantFeed;
