import SearchAccounts from "@/components/Shared/Account/SearchAccounts";
import { Button } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { ADDRESS_PLACEHOLDER } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { useAddAccountManagerMutation } from "@hey/indexer";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { isAddress } from "viem";

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

  const onCompleted = () => {
    setIsSubmitting(false);
    setShowAddManagerModal(false);
    toast.success("Account manager added");
  };

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [addAccountManager] = useAddAccountManagerMutation({
    onCompleted: async ({ addAccountManager }) => {
      return await handleTransactionLifecycle({
        transactionData: addAccountManager,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleAddManager = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
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
        onChange={(event) => setManager(event.target.value)}
        onAccountSelected={(account) => setManager(account.owner)}
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
