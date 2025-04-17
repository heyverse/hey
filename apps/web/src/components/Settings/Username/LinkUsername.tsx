import LazySmallSingleAccount from "@/components/Shared/Account/LazySmallSingleAccount";
import Loader from "@/components/Shared/Loader";
import Slug from "@/components/Shared/Slug";
import { Button, EmptyState, H6 } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import {
  useAssignUsernameToAccountMutation,
  useUsernamesQuery
} from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";

const LinkUsername = () => {
  const { currentAccount } = useAccountStore();
  const [linkingUsername, setLinkingUsername] = useState<null | string>(null);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const onCompleted = () => {
    setLinkingUsername(null);
    toast.success("Linked");
  };

  const onError = (error: Error) => {
    setLinkingUsername(null);
    errorToast(error);
  };

  const { data, loading } = useUsernamesQuery({
    variables: {
      request: { filter: { owner: currentAccount?.address } }
    }
  });

  const [assignUsernameToAccount] = useAssignUsernameToAccountMutation({
    onCompleted: async ({ assignUsernameToAccount }) => {
      if (assignUsernameToAccount.__typename === "AssignUsernameResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: assignUsernameToAccount,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleLink = async (localName: string) => {
    if (!currentAccount) {
      return;
    }

    const confirmation = confirm(
      "Are you sure you want to link this username to your account?"
    );

    if (!confirmation) {
      return;
    }

    setLinkingUsername(localName);

    return await assignUsernameToAccount({
      variables: { request: { username: { localName } } }
    });
  };

  if (loading) {
    return <Loader className="py-10" />;
  }

  const usernames = data?.usernames.items;

  if (!usernames?.length) {
    return (
      <EmptyState
        hideCard
        icon={<AtSymbolIcon className="size-8" />}
        message="No usernames found to link!"
      />
    );
  }

  return (
    <div className="m-5 flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-1.5">
        <b>Link a username</b>
        <H6 className="font-normal text-gray-500 dark:text-gray-200">
          Link a username to your account to showcase it publicly, allowing
          others to easily identify and connect with you based on your unique
          online identity.
        </H6>
      </div>
      {usernames?.map((username) => (
        <div
          className="flex flex-wrap items-center justify-between gap-3"
          key={username.value}
        >
          <div className="flex items-center space-x-2">
            <Slug className="font-bold" slug={username.value} />
            {username.linkedTo ? (
              <div className="flex items-center space-x-2">
                <span>·</span>
                <div>Linked to</div>
                <LazySmallSingleAccount address={username.linkedTo} />
              </div>
            ) : null}
          </div>
          {username.linkedTo ? null : (
            <Button
              disabled={linkingUsername === username.localName}
              loading={linkingUsername === username.localName}
              onClick={() => handleLink(username.localName)}
              outline
            >
              Link
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default LinkUsername;
