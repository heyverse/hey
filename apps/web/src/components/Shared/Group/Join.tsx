import { Button } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useApolloClient } from "@apollo/client";
import {
  type GroupFragment,
  useJoinGroupMutation,
  useRequestGroupMembershipMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";
import { toast } from "sonner";

interface JoinProps {
  group: GroupFragment;
  small: boolean;
  className?: string;
  title?: string;
  onSuccess?: () => void;
}

const Join = ({
  group,
  small,
  className = "",
  title = "Join",
  onSuccess
}: JoinProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const updateCache = () => {
    if (!group.operations) {
      return;
    }

    cache.modify({
      fields: {
        isMember: () => !group.membershipApprovalEnabled,
        hasRequestedMembership: () => group.membershipApprovalEnabled
      },
      id: cache.identify(group.operations)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    onSuccess?.();
    toast.success(
      group.membershipApprovalEnabled ? "Request sent" : "Joined group"
    );
  };

  const onError = (error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [joinGroup] = useJoinGroupMutation({
    onCompleted: async ({ joinGroup }) => {
      if (joinGroup.__typename === "JoinGroupResponse") {
        return onCompleted();
      }

      if (joinGroup.__typename === "GroupOperationValidationFailed") {
        return onError({ message: joinGroup.reason });
      }

      return await handleTransactionLifecycle({
        transactionData: joinGroup,
        onCompleted,
        onError
      });
    },
    onError
  });

  const [requestGroupMembership] = useRequestGroupMembershipMutation({
    onCompleted: async ({ requestGroupMembership }) => {
      if (
        requestGroupMembership.__typename === "RequestGroupMembershipResponse"
      ) {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: joinGroup,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleJoin = async () => {
    setIsSubmitting(true);

    if (group.membershipApprovalEnabled) {
      return await requestGroupMembership({
        variables: { request: { group: group.address } }
      });
    }

    return await joinGroup({
      variables: { request: { group: group.address } }
    });
  };

  return (
    <Button
      aria-label="Join"
      className={className}
      disabled={isSubmitting}
      loading={isSubmitting}
      onClick={handleJoin}
      outline
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Join;
