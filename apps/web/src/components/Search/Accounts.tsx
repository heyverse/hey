import { UsersIcon } from "@heroicons/react/24/outline";
import {
  AccountsOrderBy,
  type AccountsRequest,
  PageSize,
  useAccountsQuery
} from "@hey/indexer";
import { useCallback } from "react";
import { WindowVirtualizer } from "virtua";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import SingleAccountsShimmer from "@/components/Shared/Shimmer/SingleAccountsShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";

interface AccountsProps {
  query: string;
}

const Accounts = ({ query }: AccountsProps) => {
  const request: AccountsRequest = {
    filter: { searchBy: { localNameQuery: query } },
    orderBy: AccountsOrderBy.BestMatch,
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = useAccountsQuery({
    skip: !query,
    variables: { request }
  });

  const accounts = data?.accounts?.items;
  const pageInfo = data?.accounts?.pageInfo;
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
    return <SingleAccountsShimmer isBig />;
  }

  if (!accounts?.length) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <span>
            No accounts for <b>&ldquo;{query}&rdquo;</b>
          </span>
        }
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load accounts" />;
  }

  return (
    <WindowVirtualizer>
      {accounts.map((account) => (
        <Card className="mb-5 p-5" key={account.address}>
          <SingleAccount account={account} isBig showBio />
        </Card>
      ))}
      {hasMore && <span ref={loadMoreRef} />}
    </WindowVirtualizer>
  );
};

export default Accounts;
