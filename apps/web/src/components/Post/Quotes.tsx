import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostFragment,
  type PostReferencesRequest,
  PostReferenceType,
  usePostReferencesQuery
} from "@hey/indexer";
import { useCallback } from "react";
import { WindowVirtualizer } from "virtua";
import BackButton from "@/components/Shared/BackButton";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import {
  Card,
  CardHeader,
  EmptyState,
  ErrorMessage
} from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import SinglePost from "./SinglePost";

interface QuotesProps {
  post: PostFragment;
}

const Quotes = ({ post }: QuotesProps) => {
  const request: PostReferencesRequest = {
    pageSize: PageSize.Fifty,
    referencedPost: post.id,
    referenceTypes: [PostReferenceType.QuoteOf]
  };

  const { data, error, fetchMore, loading } = usePostReferencesQuery({
    skip: !post.id,
    variables: { request }
  });

  const quotes = data?.postReferences?.items ?? [];
  const pageInfo = data?.postReferences?.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = useCallback(async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  }, [fetchMore, hasMore, pageInfo?.next, request]);

  const loadMoreRef = useLoadMoreOnIntersect(handleEndReached);

  if (error) {
    return <ErrorMessage error={error} title="Failed to load comment feed" />;
  }

  return (
    <Card>
      <CardHeader icon={<BackButton />} title="Quotes" />
      {loading ? (
        <PostsShimmer hideCard />
      ) : error ? (
        <ErrorMessage error={error} title="Failed to load comment feed" />
      ) : quotes.length ? (
        <div className="virtual-divider-list-window">
          <WindowVirtualizer>
            {quotes.map((quote) => (
              <SinglePost key={quote.id} post={quote} showType={false} />
            ))}
            {hasMore && <span ref={loadMoreRef} />}
          </WindowVirtualizer>
        </div>
      ) : (
        <EmptyState
          hideCard
          icon={<ChatBubbleBottomCenterTextIcon className="size-8" />}
          message="Be the first one to quote!"
        />
      )}
    </Card>
  );
};

export default Quotes;
