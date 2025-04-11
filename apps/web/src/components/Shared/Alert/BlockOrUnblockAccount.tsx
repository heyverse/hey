import { Alert } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useBlockAlertStore } from "@/store/non-persisted/alert/useBlockAlertStore";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useApolloClient } from "@apollo/client";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import { useBlockMutation, useUnblockMutation } from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";

const BlockOrUnblockAccount = () => {
  const { currentAccount } = useAccountStore();
  const {
    blockingorUnblockingAccount,
    setShowBlockOrUnblockAlert,
    showBlockOrUnblockAlert
  } = useBlockAlertStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(
    blockingorUnblockingAccount?.operations?.isBlockedByMe
  );
  const { isSuspended } = useAccountStatus();
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    if (!blockingorUnblockingAccount?.operations) {
      return;
    }

    cache.modify({
      fields: { isBlockedByMe: () => !hasBlocked },
      id: cache.identify(blockingorUnblockingAccount?.operations)
    });
    cache.evict({ id: cache.identify(blockingorUnblockingAccount) });
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

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [block] = useBlockMutation({
    onCompleted: async ({ block }) => {
      if (block.__typename === "AccountBlockedResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: block,
        onCompleted,
        onError
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
        transactionData: unblock,
        onCompleted,
        onError
      });
    },
    onError
  });

  const blockOrUnblock = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);

    // Unblock
    if (hasBlocked) {
      return await unblock({
        variables: {
          request: { account: blockingorUnblockingAccount?.address }
        }
      });
    }

    // Block
    return await block({
      variables: {
        request: { account: blockingorUnblockingAccount?.address }
      }
    });
  };

  return (
    <Alert
      confirmText={hasBlocked ? "Unblock" : "Block"}
      description={`Are you sure you want to ${
        hasBlocked ? "un-block" : "block"
      } ${getAccount(blockingorUnblockingAccount).usernameWithPrefix}?`}
      isDestructive
      isPerformingAction={isSubmitting}
      onClose={() => setShowBlockOrUnblockAlert(false)}
      onConfirm={blockOrUnblock}
      show={showBlockOrUnblockAlert}
      title="Block Account"
    />
  );
};

export default BlockOrUnblockAccount;
