import SingleAccount from "@/components/Shared/Account/SingleAccount";
import Loader from "@/components/Shared/Loader";
import { Button, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { UsersIcon } from "@heroicons/react/24/outline";
import {
  type AccountsAvailableRequest,
  type LastLoggedInAccountRequest,
  ManagedAccountsVisibility,
  useAccountsAvailableQuery,
  useHideManagedAccountMutation,
  useUnhideManagedAccountMutation
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { toast } from "sonner";
import { WindowVirtualizer } from "virtua";
import { useAccount } from "wagmi";

interface ListProps {
  managed?: boolean;
}

const List = ({ managed = false }: ListProps) => {
  const { address } = useAccount();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

  const lastLoggedInAccountRequest: LastLoggedInAccountRequest = { address };
  const accountsAvailableRequest: AccountsAvailableRequest = {
    managedBy: address,
    hiddenFilter: managed
      ? ManagedAccountsVisibility.NoneHidden
      : ManagedAccountsVisibility.HiddenOnly
  };

  const { data, error, fetchMore, loading, refetch } =
    useAccountsAvailableQuery({
      variables: {
        lastLoggedInAccountRequest,
        accountsAvailableRequest
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

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: {
          lastLoggedInAccountRequest,
          accountsAvailableRequest: {
            ...accountsAvailableRequest,
            cursor: pageInfo.next
          }
        }
      });
    }
  };

  useEffect(() => {
    if (entry?.isIntersecting) {
      onEndReached();
    }
  }, [entry?.isIntersecting]);

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
    try {
      if (managed) {
        await hideManagedAccount({ variables: { request: { account } } });
        toast.success("Account is now un-managed");

        return refetch();
      }

      await unhideManagedAccount({ variables: { request: { account } } });
      toast.success("Account is now managed");

      return refetch();
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <WindowVirtualizer>
      {accountsAvailable.map((accountAvailable) => (
        <div
          className="flex items-center justify-between py-2"
          key={accountAvailable.account.address}
        >
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            account={accountAvailable.account}
          />
          {address !== accountAvailable.account.owner && (
            <Button
              disabled={hiding || unhiding}
              loading={hiding || unhiding}
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
      {hasMore && <span ref={ref} />}
    </WindowVirtualizer>
  );
};

export default List;
