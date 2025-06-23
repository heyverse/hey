import { useApolloClient } from "@apollo/client";
import {
  type AccountManagerFragment,
  useUpdateAccountManagerMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";
import { Checkbox } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";

interface PermissionProps {
  title: string;
  enabled: boolean;
  manager: AccountManagerFragment;
}

const Permission = ({ title, enabled, manager }: PermissionProps) => {
  const { currentAccount } = useAccountStore();
  const { setShowAuthModal } = useAuthModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.modify({
      fields: {
        permissions: (existingData) => ({
          ...existingData,
          canTransferNative: !enabled,
          canTransferTokens: !enabled
        })
      },
      id: cache.identify(manager)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
  };

  const onError = (error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [updateAccountManager] = useUpdateAccountManagerMutation({
    onCompleted: async ({ updateAccountManager }) => {
      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: updateAccountManager
      });
    },
    onError
  });

  const handleUpdateManager = async () => {
    if (!currentAccount) {
      return setShowAuthModal(true);
    }

    setIsSubmitting(true);

    return await updateAccountManager({
      variables: {
        request: {
          manager: manager.manager,
          permissions: {
            canExecuteTransactions: true,
            canSetMetadataUri: true,
            canTransferNative: !enabled,
            canTransferTokens: !enabled
          }
        }
      }
    });
  };

  return (
    <div className="text-gray-500 text-sm">
      <Checkbox
        checked={enabled}
        disabled={isSubmitting}
        label={title}
        onChange={handleUpdateManager}
      />
    </div>
  );
};

export default Permission;
