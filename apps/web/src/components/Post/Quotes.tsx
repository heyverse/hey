import BackButton from "@/components/Shared/BackButton";
import {
  Card,
  CardHeader,
  EmptyState,
  ErrorMessage
} from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostFragment,
  PostReferenceType,
  type PostReferencesRequest,
  usePostReferencesQuery
} from "@hey/indexer";
import { WindowVirtualizer } from "virtua";
import PostsShimmer from "../Shared/Shimmer/PostsShimmer";
import SinglePost from "./SinglePost";

interface QuotesProps {
  post: PostFragment;
}

const Quotes = ({ post }: QuotesProps) => {
  const request: PostReferencesRequest = {
    pageSize: PageSize.Fifty,
    referenceTypes: [PostReferenceType.QuoteOf],
    referencedPost: post.id
  };

  const { data, error, fetchMore, loading } = usePostReferencesQuery({
    skip: !post.id,
    variables: { request }
  });

  const quotes = data?.postReferences?.items ?? [];
  const pageInfo = data?.postReferences?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  const loadMoreRef = useLoadMoreOnIntersect(onEndReached);

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
          icon={<ChatBubbleBottomCenterTextIcon className="size-8" />}
          message="Be the first one to quote!"
          hideCard
        />
      )}
    </Card>
  );
};

export default Quotes;
