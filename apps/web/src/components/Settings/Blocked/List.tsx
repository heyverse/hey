import { NoSymbolIcon } from "@heroicons/react/24/outline";
import {
  type AccountsBlockedRequest,
  PageSize,
  useAccountsBlockedQuery
} from "@hey/indexer";
import { WindowVirtualizer } from "virtua";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import Loader from "@/components/Shared/Loader";
import { Button, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { useBlockAlertStore } from "@/store/non-persisted/alert/useBlockAlertStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const List = () => {
  const { currentAccount } = useAccountStore();
  const { setShowBlockOrUnblockAlert } = useBlockAlertStore();

  const request: AccountsBlockedRequest = { pageSize: PageSize.Fifty };
  const { data, error, fetchMore, loading } = useAccountsBlockedQuery({
    skip: !currentAccount?.address,
    variables: { request }
  });

  const accountsBlocked = data?.accountsBlocked?.items;
  const pageInfo = data?.accountsBlocked?.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  const loadMoreRef = useLoadMoreOnIntersect(handleEndReached);

  if (loading) {
    return <Loader className="my-10" />;
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load blocked accounts" />
    );
  }

  if (!accountsBlocked?.length) {
    return (
      <EmptyState
        hideCard
        icon={<NoSymbolIcon className="size-8" />}
        message="You are not blocking any accounts!"
      />
    );
  }

  return (
    <div className="virtual-divider-list-window space-y-4">
      <WindowVirtualizer>
        {accountsBlocked.map((accountBlocked) => (
          <div
            className="flex items-center justify-between p-5"
            key={accountBlocked.account.address}
          >
            <SingleAccount
              account={accountBlocked.account}
              hideFollowButton
              hideUnfollowButton
            />
            <Button
              onClick={() =>
                setShowBlockOrUnblockAlert(true, accountBlocked.account)
              }
            >
              Unblock
            </Button>
          </div>
        ))}
        {hasMore && <span ref={loadMoreRef} />}
      </WindowVirtualizer>
    </div>
  );
};

export default List;
