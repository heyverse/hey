import { ADDRESS_PLACEHOLDER } from "@hey/data/constants";
import { ERRORS } from "@hey/data/errors";
import { useAddAccountManagerMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { isAddress } from "viem";
import SearchAccounts from "@/components/Shared/Account/SearchAccounts";
import { Button } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import logEvent from "@/helpers/logEvent";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";
import { useAccountStore } from "@/store/persisted/useAccountStore";

interface AddAccountManagerProps {
  setShowAddManagerModal: Dispatch<SetStateAction<boolean>>;
}

const AddAccountManager = ({
  setShowAddManagerModal
}: AddAccountManagerProps) => {
  const { currentAccount } = useAccountStore();
  const [manager, setManager] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();

  const onCompleted = async (hash: string) => {
    setIsSubmitting(false);
    setShowAddManagerModal(false);
    const toastId = toast.loading("Adding manager...");
    await waitForTransactionToComplete(hash);
    toast.success("Manager added successfully", { id: toastId });
    void logEvent("Add Account Manager");
    location.reload();
  };

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [addAccountManager] = useAddAccountManagerMutation({
    onCompleted: async ({ addAccountManager }) => {
      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: addAccountManager
      });
    },
    onError
  });

  const handleAddManager = async () => {
    if (!currentAccount) {
      return toast.error(ERRORS.SignWallet);
    }

    setIsSubmitting(true);

    return await addAccountManager({
      variables: {
        request: {
          address: manager,
          permissions: {
            canExecuteTransactions: true,
            canSetMetadataUri: true,
            canTransferNative: true,
            canTransferTokens: true
          }
        }
      }
    });
  };

  return (
    <div className="space-y-4 p-5">
      <SearchAccounts
        error={manager.length > 0 && !isAddress(manager)}
        hideDropdown={isAddress(manager)}
        onAccountSelected={(account) => setManager(account.owner)}
        onChange={(event) => setManager(event.target.value)}
        placeholder={`${ADDRESS_PLACEHOLDER} or wagmi`}
        value={manager}
      />
      <div className="flex">
        <Button
          className="ml-auto"
          disabled={isSubmitting || !isAddress(manager)}
          loading={isSubmitting}
          onClick={handleAddManager}
          type="submit"
        >
          Add manager
        </Button>
      </div>
    </div>
  );
};

export default AddAccountManager;
