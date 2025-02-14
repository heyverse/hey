import { useApolloClient } from "@apollo/client";
import LazySingleAccount from "@components/Shared/LazySingleAccount";
import Loader from "@components/Shared/Loader";
import errorToast from "@helpers/errorToast";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import {
  AccountManagersDocument,
  type AccountManagersRequest,
  PageSize,
  useAccountManagersQuery,
  useRemoveAccountManagerMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

const List: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [removingAddress, setRemovingAddress] = useState<string | null>(null);
  const { cache } = useApolloClient();
  const { data: walletClient } = useWalletClient();

  const updateCache = (hash: string) => {
    if (hash && data?.accountManagers?.items) {
      const updatedManagers = data.accountManagers.items.filter(
        (item) => item.manager !== removingAddress
      );

      cache.writeQuery({
        query: AccountManagersDocument,
        variables: { request },
        data: {
          accountManagers: {
            ...data.accountManagers,
            items: updatedManagers
          }
        }
      });
    }
  };

  const onCompleted = (hash: string) => {
    setRemovingAddress(null);
    updateCache(hash);
    addSimpleOptimisticTransaction(
      hash,
      OptimisticTxType.REMOVE_ACCOUNT_MANAGER
    );
    toast.success("Manager removed successfully");
  };

  const onError = (error: any) => {
    errorToast(error);
    setRemovingAddress(null);
  };

  const request: AccountManagersRequest = { pageSize: PageSize.Fifty };
  const { data, error, fetchMore, loading } = useAccountManagersQuery({
    variables: { request }
  });

  const [removeAccountManager] = useRemoveAccountManagerMutation({
    onCompleted: async ({ removeAccountManager }) => {
      if (walletClient) {
        try {
          if (
            removeAccountManager.__typename === "SponsoredTransactionRequest"
          ) {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(removeAccountManager.raw)
            });

            return onCompleted(hash);
          }

          if (
            removeAccountManager.__typename === "SelfFundedTransactionRequest"
          ) {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(removeAccountManager.raw)
            });

            return onCompleted(hash);
          }

          if (removeAccountManager.__typename === "TransactionWillFail") {
            return toast.error(removeAccountManager.reason);
          }
        } catch (error) {
          return onError(error);
        }
      }
    },
    onError
  });

  const handleRemoveManager = async (manager: string) => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setRemovingAddress(manager);

    return await removeAccountManager({
      variables: { request: { manager } }
    });
  };

  const accountManagers = data?.accountManagers.items.filter(
    (item) => !item.isLensManager
  );
  const pageInfo = data?.accountManagers?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <Loader className="my-10" />;
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load profile managers" />
    );
  }

  if (accountManagers?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UserCircleIcon className="size-8" />}
        message="No profile managers added!"
      />
    );
  }

  return (
    <Virtuoso
      computeItemKey={(index, accountManager) =>
        `${accountManager.manager}-${index}`
      }
      data={accountManagers}
      endReached={onEndReached}
      itemContent={(_, accountManager) => (
        <div className="flex items-center justify-between py-2">
          <LazySingleAccount address={accountManager.manager} />
          <Button
            disabled={removingAddress === accountManager.manager}
            onClick={() => handleRemoveManager(accountManager.manager)}
            outline
          >
            Remove
          </Button>
        </div>
      )}
      useWindowScroll
    />
  );
};

export default List;
