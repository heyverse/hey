import WalletAccount from "@/components/Shared/Account/WalletAccount";
import Loader from "@/components/Shared/Loader";
import { Button, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useApolloClient } from "@apollo/client";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ERRORS } from "@hey/data/errors";
import {
  type AccountManagerFragment,
  type AccountManagersRequest,
  PageSize,
  useAccountManagersQuery,
  useRemoveAccountManagerMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";
import { toast } from "sonner";
import { WindowVirtualizer } from "virtua";
import Permission from "./Permission";

const List = () => {
  const { currentAccount } = useAccountStore();
  const [removingManager, setRemovingManager] =
    useState<AccountManagerFragment | null>(null);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    if (removingManager) {
      cache.evict({
        id: cache.identify(removingManager)
      });
    }
  };

  const onCompleted = () => {
    setRemovingManager(null);
    updateCache();
    toast.success("Manager removed successfully");
  };

  const onError = (error: ApolloClientError) => {
    errorToast(error);
    setRemovingManager(null);
  };

  const request: AccountManagersRequest = { pageSize: PageSize.Fifty };
  const { data, error, fetchMore, loading } = useAccountManagersQuery({
    variables: { request }
  });

  const [removeAccountManager] = useRemoveAccountManagerMutation({
    onCompleted: async ({ removeAccountManager }) => {
      return await handleTransactionLifecycle({
        transactionData: removeAccountManager,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleRemoveManager = async (manager: AccountManagerFragment) => {
    if (!currentAccount) {
      return toast.error(ERRORS.SignWallet);
    }

    setRemovingManager(manager);

    return await removeAccountManager({
      variables: { request: { manager: manager.manager } }
    });
  };

  const accountManagers = data?.accountManagers.items.filter(
    (item) => !item.isLensManager
  );
  const pageInfo = data?.accountManagers?.pageInfo;
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
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load account managers"
      />
    );
  }

  if (!accountManagers?.length) {
    return (
      <EmptyState
        hideCard
        icon={<UserCircleIcon className="size-8" />}
        message="No account managers added!"
      />
    );
  }

  return (
    <WindowVirtualizer>
      {accountManagers.map((accountManager) => (
        <div
          className="flex flex-wrap items-center justify-between p-5"
          key={accountManager.manager}
        >
          <div className="flex flex-col gap-y-3">
            <WalletAccount address={accountManager.manager} />
            <Permission
              title="Can spend funds"
              enabled={
                accountManager.permissions.canExecuteTransactions &&
                accountManager.permissions.canTransferNative &&
                accountManager.permissions.canTransferTokens
              }
              manager={accountManager}
            />
          </div>
          <Button
            disabled={removingManager?.manager === accountManager.manager}
            loading={removingManager?.manager === accountManager.manager}
            onClick={() => handleRemoveManager(accountManager)}
            outline
          >
            Remove
          </Button>
        </div>
      ))}
      {hasMore && <span ref={loadMoreRef} />}
    </WindowVirtualizer>
  );
};

export default List;
