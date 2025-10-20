import { PERMISSIONS } from "@hey/data/constants";
import { useJoinGroupMutation, useLeaveGroupMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useCallback, useState } from "react";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const BetaToggle = () => {
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();

  const onCompleted = async (hash: string) => {
    await waitForTransactionToComplete(hash);
    location.reload();
  };

  const onError = useCallback((error: ApolloClientError) => {
    errorToast(error);
  }, []);

  const [joinGroup] = useJoinGroupMutation({
    onCompleted: async ({ joinGroup }) => {
      if (joinGroup.__typename === "JoinGroupResponse") {
        return await onCompleted(joinGroup.hash);
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: joinGroup
      });
    },
    onError
  });

  const [leaveGroup] = useLeaveGroupMutation({
    onCompleted: async ({ leaveGroup }) => {
      if (leaveGroup.__typename === "LeaveGroupResponse") {
        return await onCompleted(leaveGroup.hash);
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: leaveGroup
      });
    },
    onError
  });

  if (!currentAccount) {
    return null;
  }

  const toggleBeta = async () => {
    setIsSubmitting(true);

    const variables = { request: { group: PERMISSIONS.BETA } };

    if (currentAccount?.isBeta) {
      return await leaveGroup({ variables });
    }

    return await joinGroup({ variables });
  };

  return (
    <ToggleWithHelper
      description="Get early access to new features"
      disabled={isSubmitting}
      heading="Beta"
      on={currentAccount?.isBeta}
      setOn={toggleBeta}
    />
  );
};

export default BetaToggle;
