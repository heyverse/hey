import { useApolloClient } from "@apollo/client";
import { ERRORS } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import { useBlockMutation, useUnblockMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useBlockAlertStore } from "@/store/non-persisted/alert/useBlockAlertStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const BlockOrUnblockAccount = () => {
  const { currentAccount } = useAccountStore();
  const {
    blockingOrUnblockingAccount,
    setShowBlockOrUnblockAlert,
    showBlockOrUnblockAlert
  } = useBlockAlertStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(
    blockingOrUnblockingAccount?.operations?.isBlockedByMe
  );
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    if (!blockingOrUnblockingAccount?.operations) {
      return;
    }

    cache.modify({
      fields: { isBlockedByMe: () => !hasBlocked },
      id: cache.identify(blockingOrUnblockingAccount?.operations)
    });
    cache.evict({ id: cache.identify(blockingOrUnblockingAccount) });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    setHasBlocked(!hasBlocked);
    setShowBlockOrUnblockAlert(false);
    toast.success(
      hasBlocked ? "Unblocked successfully" : "Blocked successfully"
    );
  };

  const onError = (error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [block] = useBlockMutation({
    onCompleted: async ({ block }) => {
      if (block.__typename === "AccountBlockedResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: block
      });
    },
    onError
  });

  const [unblock] = useUnblockMutation({
    onCompleted: async ({ unblock }) => {
      if (unblock.__typename === "AccountUnblockedResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: unblock
      });
    },
    onError
  });

  const blockOrUnblock = async () => {
    if (!currentAccount) {
      return toast.error(ERRORS.SignWallet);
    }

    setIsSubmitting(true);

    // Unblock
    if (hasBlocked) {
      return await unblock({
        variables: {
          request: { account: blockingOrUnblockingAccount?.address }
        }
      });
    }

    // Block
    return await block({
      variables: {
        request: { account: blockingOrUnblockingAccount?.address }
      }
    });
  };

  return (
    <Alert
      confirmText={hasBlocked ? "Unblock" : "Block"}
      description={`Are you sure you want to ${
        hasBlocked ? "unblock" : "block"
      } ${getAccount(blockingOrUnblockingAccount).usernameWithPrefix}?`}
      isPerformingAction={isSubmitting}
      onClose={() => setShowBlockOrUnblockAlert(false)}
      onConfirm={blockOrUnblock}
      show={showBlockOrUnblockAlert}
      title="Block Account"
    />
  );
};

export default BlockOrUnblockAccount;
