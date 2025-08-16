import { GiftIcon } from "@heroicons/react/24/outline";
import { BLOCK_EXPLORER_URL } from "@hey/data/constants";
import {
  PageSize,
  type TokenDistributionsRequest,
  useTokenDistributionsQuery
} from "@hey/indexer";
import dayjs from "dayjs";
import { useCallback } from "react";
import { Link } from "react-router";
import { WindowVirtualizer } from "virtua";
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

  const tokenRewards = data?.tokenDistributions?.items;
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

  if (!tokenRewards?.length) {
    return (
      <EmptyState
        hideCard
        icon={<GiftIcon className="size-8" />}
        message="You haven't received any rewards yet."
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load rewards"
      />
    );
  }

  return (
    <div className="virtual-divider-list-window">
      <WindowVirtualizer>
        {tokenRewards.map((distribution) => (
          <div
            className="flex items-center justify-between p-5"
            key={distribution.txHash}
          >
            <div className="flex items-center space-x-2">
              <GiftIcon className="size-4 text-gray-500 dark:text-gray-200" />
              <div>
                Received <b>{Number(distribution.amount.value).toFixed(4)}</b>
              </div>
            </div>
            <Link
              className="text-gray-500 text-sm dark:text-gray-200"
              rel="noreferrer noopener"
              target="_blank"
              to={`${BLOCK_EXPLORER_URL}/tx/${distribution.txHash}`}
            >
              {dayjs(distribution.timestamp).format("MMM D, YYYY h:mm A")}
            </Link>
          </div>
        ))}
        {hasMore && <span ref={loadMoreRef} />}
      </WindowVirtualizer>
    </div>
  );
};

export default List;
