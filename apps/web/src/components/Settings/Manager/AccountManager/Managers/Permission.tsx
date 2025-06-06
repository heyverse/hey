import { Checkbox } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useApolloClient } from "@apollo/client";
import {
  type AccountManagerFragment,
  useUpdateAccountManagerMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";

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
      id: cache.identify(manager),
      fields: {
        permissions: (existingData) => ({
          ...existingData,
          canTransferNative: !enabled,
          canTransferTokens: !enabled
        })
      }
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
        transactionData: updateAccountManager,
        onCompleted,
        onError
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
            canTransferNative: !enabled,
            canTransferTokens: !enabled,
            canExecuteTransactions: true,
            canSetMetadataUri: true
          }
        }
      }
    });
  };

  return (
    <div className="text-gray-500 text-sm">
      <Checkbox
        label={title}
        checked={enabled}
        onChange={handleUpdateManager}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default Permission;
