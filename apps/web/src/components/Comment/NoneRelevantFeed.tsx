import { useHiddenCommentFeedStore } from "@/components/Post";
import SinglePost from "@/components/Post/SinglePost";
import { Card, StackedAvatars } from "@/components/Shared/UI";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { AVATAR_TINY } from "@hey/data/constants";
import getAvatar from "@hey/helpers/getAvatar";
import {
  PageSize,
  PostReferenceType,
  type PostReferencesRequest,
  PostVisibilityFilter,
  ReferenceRelevancyFilter,
  type ReferencedPostFragment,
  usePostReferencesQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { WindowVirtualizer } from "virtua";

interface NoneRelevantFeedProps {
  postId: string;
}

const NoneRelevantFeed = ({ postId }: NoneRelevantFeedProps) => {
  const { showHiddenComments } = useHiddenCommentFeedStore();
  const [showMore, setShowMore] = useState(false);
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

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
            getAvatar(comment.author, AVATAR_TINY)
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
        <Card className="virtual-divider-list-window">
          <WindowVirtualizer>
            {filteredComments.map((comment) => (
              <SinglePost key={comment.id} post={comment} showType={false} />
            ))}
            {hasMore && <span ref={ref} />}
          </WindowVirtualizer>
        </Card>
      ) : null}
    </>
  );
};

export default NoneRelevantFeed;
