import { Button } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useApolloClient } from "@apollo/client";
import { type GroupFragment, useLeaveGroupMutation } from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";

interface LeaveProps {
  group: GroupFragment;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Leave = ({ group, setJoined, small }: LeaveProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    if (!group.operations) {
      return;
    }

    cache.modify({
      fields: { isMember: () => false },
      id: cache.identify(group.operations)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    setJoined(false);
    toast.success("Left group");
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [leaveGroup] = useLeaveGroupMutation({
    onCompleted: async ({ leaveGroup }) => {
      if (leaveGroup.__typename === "LeaveGroupResponse") {
        return onCompleted();
      }

      if (leaveGroup.__typename === "GroupOperationValidationFailed") {
        return onError({ message: leaveGroup.reason });
      }

      return await handleTransactionLifecycle({
        transactionData: leaveGroup,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleLeave = async () => {
    setIsSubmitting(true);

    return await leaveGroup({
      variables: { request: { group: group.address } }
    });
  };

  return (
    <Button
      aria-label="Leave"
      disabled={isSubmitting}
      loading={isSubmitting}
      onClick={handleLeave}
      size={small ? "sm" : "md"}
    >
      Leave
    </Button>
  );
};

export default Leave;
