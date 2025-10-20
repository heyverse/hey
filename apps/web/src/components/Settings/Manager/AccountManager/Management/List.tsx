import { UsersIcon } from "@heroicons/react/24/outline";
import {
  type AccountsAvailableRequest,
  type LastLoggedInAccountRequest,
  ManagedAccountsVisibility,
  useAccountsAvailableQuery,
  useHideManagedAccountMutation,
  useUnhideManagedAccountMutation
} from "@hey/indexer";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import Loader from "@/components/Shared/Loader";
import { Button, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";

interface ListProps {
  managed?: boolean;
}

const List = ({ managed = false }: ListProps) => {
  const { address } = useAccount();
  const [updatingAccount, setUpdatingAccount] = useState<string | null>(null);

  const lastLoggedInAccountRequest: LastLoggedInAccountRequest = { address };
  const accountsAvailableRequest: AccountsAvailableRequest = {
    hiddenFilter: managed
      ? ManagedAccountsVisibility.NoneHidden
      : ManagedAccountsVisibility.HiddenOnly,
    managedBy: address
  };

  const { data, error, fetchMore, loading, refetch } =
    useAccountsAvailableQuery({
      variables: {
        accountsAvailableRequest,
        lastLoggedInAccountRequest
      }
    });

  const [hideManagedAccount, { loading: hiding }] =
    useHideManagedAccountMutation();
  const [unhideManagedAccount, { loading: unhiding }] =
    useUnhideManagedAccountMutation();

  useEffect(() => {
    refetch();
  }, [managed, refetch]);

  const accountsAvailable = data?.accountsAvailable.items;
  const pageInfo = data?.accountsAvailable?.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = useCallback(async () => {
    if (hasMore) {
      await fetchMore({
        variables: {
          accountsAvailableRequest: {
            ...accountsAvailableRequest,
            cursor: pageInfo.next
          },
          lastLoggedInAccountRequest
        }
      });
    }
  }, [
    fetchMore,
    hasMore,
    pageInfo?.next,
    accountsAvailableRequest,
    lastLoggedInAccountRequest
  ]);

  const loadMoreRef = useLoadMoreOnIntersect(handleEndReached);

  if (loading) {
    return <Loader className="my-10" />;
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        title={
          managed
            ? "Failed to load managed accounts"
            : "Failed to load un-managed accounts"
        }
      />
    );
  }

  if (!accountsAvailable?.length) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message={
          managed
            ? "You are not managing any accounts!"
            : "You are not un-managing any accounts!"
        }
      />
    );
  }

  const handleToggleManagement = async (account: string) => {
    setUpdatingAccount(account);

    try {
      if (managed) {
        await hideManagedAccount({ variables: { request: { account } } });
        toast.success("Account is now un-managed");
      } else {
        await unhideManagedAccount({ variables: { request: { account } } });
        toast.success("Account is now managed");
      }
      setTimeout(() => refetch(), 500);
    } catch (error) {
      errorToast(error);
    } finally {
      setUpdatingAccount(null);
    }
  };

  return (
    <div>
      {accountsAvailable.map((accountAvailable) => (
        <div
          className="flex items-center justify-between py-2"
          key={accountAvailable.account.address}
        >
          <SingleAccount
            account={accountAvailable.account}
            hideFollowButton
            hideUnfollowButton
          />
          {address !== accountAvailable.account.owner && (
            <Button
              disabled={hiding || unhiding}
              loading={
                (hiding || unhiding) &&
                updatingAccount === accountAvailable.account.address
              }
              onClick={() =>
                handleToggleManagement(accountAvailable.account.address)
              }
              outline
              size="sm"
            >
              {managed ? "Un-manage" : "Manage"}
            </Button>
          )}
        </div>
      ))}
      {hasMore && <span ref={loadMoreRef} />}
    </div>
  );
};

export default List;
