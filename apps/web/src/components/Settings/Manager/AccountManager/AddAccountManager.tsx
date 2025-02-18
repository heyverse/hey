import SearchAccounts from "@components/Shared/SearchAccounts";
import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import errorToast from "@helpers/errorToast";
import { ADDRESS_PLACEHOLDER } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { useAddAccountManagerMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button } from "@hey/ui";
import type { Dispatch, FC, SetStateAction } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionHandler";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { isAddress } from "viem";

interface AddAccountManagerProps {
  setShowAddManagerModal: Dispatch<SetStateAction<boolean>>;
}

const AddAccountManager: FC<AddAccountManagerProps> = ({
  setShowAddManagerModal
}) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();

  const [manager, setManager] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canExecuteTransactions, setCanExecuteTransactions] = useState(true);
  const [canSetMetadataUri, setCanSetMetadataUri] = useState(true);

  const { handleTransactionLifecycle } = useTransactionLifecycle();

  const onCompleted = (hash: string) => {
    setIsLoading(false);
    setShowAddManagerModal(false);
    addSimpleOptimisticTransaction(hash, OptimisticTxType.ADD_ACCOUNT_MANAGER);
    toast.success("Account manager added");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [addAccountManager] = useAddAccountManagerMutation({
    onCompleted: async ({ addAccountManager }) => {
      await handleTransactionLifecycle({
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

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return await addAccountManager({
      variables: {
        request: {
          address: manager,
          permissions: {
            canExecuteTransactions,
            canSetMetadataUri,
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
        onAccountSelected={(account) => setManager(account.address)}
        placeholder={`${ADDRESS_PLACEHOLDER} or wagmi`}
        value={manager}
      />
      <div className="space-y-3 py-3">
        <ToggleWithHelper
          description="The manager can spend and transfer funds on your behalf"
          heading="Enable Financial Transactions"
          on={canExecuteTransactions}
          setOn={setCanExecuteTransactions}
        />
        <ToggleWithHelper
          description="The manager can update your profile"
          heading="Enable Profile Updates"
          on={canSetMetadataUri}
          setOn={setCanSetMetadataUri}
        />
      </div>
      <div className="flex">
        <Button
          className="ml-auto"
          disabled={isLoading || !isAddress(manager)}
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
