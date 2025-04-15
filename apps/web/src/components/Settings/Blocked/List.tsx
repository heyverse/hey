import SingleAccount from "@/components/Shared/Account/SingleAccount";
import Loader from "@/components/Shared/Loader";
import { Button, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import { useBlockAlertStore } from "@/store/non-persisted/alert/useBlockAlertStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import {
  type AccountsBlockedRequest,
  PageSize,
  useAccountsBlockedQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { WindowVirtualizer } from "virtua";

const List = () => {
  const { currentAccount } = useAccountStore();
  const { setShowBlockOrUnblockAlert } = useBlockAlertStore();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

  const request: AccountsBlockedRequest = { pageSize: PageSize.Fifty };
  const { data, error, fetchMore, loading } = useAccountsBlockedQuery({
    skip: !currentAccount?.address,
    variables: { request }
  });

  const accountsBlocked = data?.accountsBlocked?.items;
  const pageInfo = data?.accountsBlocked?.pageInfo;
  const hasMore = pageInfo?.next;

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

  if (loading) {
    return <Loader className="py-10" />;
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
              hideFollowButton
              hideUnfollowButton
              account={accountBlocked.account}
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
        {hasMore && <span ref={ref} />}
      </WindowVirtualizer>
    </div>
  );
};

export default List;
