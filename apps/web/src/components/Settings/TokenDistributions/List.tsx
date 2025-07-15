import { SparklesIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type TokenDistributionsRequest,
  useTokenDistributionsQuery
} from "@hey/indexer";
import { useCallback } from "react";
import Loader from "@/components/Shared/Loader";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";

const List = () => {
  const request: TokenDistributionsRequest = {
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = useTokenDistributionsQuery({
    variables: { request }
  });

  const tokenDistributions = data?.tokenDistributions?.items;
  const pageInfo = data?.tokenDistributions?.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = useCallback(async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  }, [fetchMore, hasMore, pageInfo?.next, request]);

  const loadMoreRef = useLoadMoreOnIntersect(handleEndReached);

  if (loading) {
    return <Loader className="my-10" />;
  }

  if (!tokenDistributions?.length) {
    return (
      <EmptyState
        hideCard
        icon={<SparklesIcon className="size-8" />}
        message="You haven't received any token distributions yet."
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load token distributions"
      />
    );
  }

  return (
    <div className="m-5 flex flex-col gap-y-4">
      {tokenDistributions.map((distribution) => (
        <div key={distribution.txHash}>
          <div>{distribution.amount.value}</div>
          <div>{distribution.timestamp}</div>
          <div>{distribution.txHash}</div>
        </div>
      ))}
      {hasMore && <span ref={loadMoreRef} />}
    </div>
  );
};

export default List;
