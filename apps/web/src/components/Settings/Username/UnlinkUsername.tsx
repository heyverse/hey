import { Button, H6 } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import { useUnassignUsernameFromAccountMutation } from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";

const UnlinkUsername = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [unlinking, setUnlinking] = useState<boolean>(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const onCompleted = () => {
    setUnlinking(false);
    toast.success("Unlinked");
  };

  const onError = (error: Error) => {
    setUnlinking(false);
    errorToast(error);
  };

  const [unassignUsernameFromAccount] = useUnassignUsernameFromAccountMutation({
    onCompleted: async ({ unassignUsernameFromAccount }) => {
      if (
        unassignUsernameFromAccount.__typename === "UnassignUsernameResponse"
      ) {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: unassignUsernameFromAccount,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleUnlink = async () => {
    if (!currentAccount) {
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setUnlinking(true);

    return await unassignUsernameFromAccount({
      variables: { request: { namespace: currentAccount.username?.namespace } }
    });
  };

  return (
    <div className="m-5 flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-1.5">
        <b>Unlink default username</b>
        <div className="flex flex-col gap-y-1.5">
          <H6 className="font-normal text-gray-500 dark:text-gray-200">
            Unlinking your default username will remove it from your account,
            preventing others from easily identifying and connecting with you
            based on your unique online identity.
          </H6>
        </div>
      </div>
      <Button disabled={unlinking} onClick={handleUnlink} outline>
        Un-link {getAccount(currentAccount).usernameWithPrefix}
      </Button>
    </div>
  );
};

export default UnlinkUsername;
