import { Button } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useApolloClient } from "@apollo/client";
import {
  type GroupFragment,
  useCancelGroupMembershipRequestMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";
import { toast } from "sonner";

interface CancelGroupMembershipRequestProps {
  group: GroupFragment;
  small: boolean;
}

const CancelGroupMembershipRequest = ({
  group,
  small
}: CancelGroupMembershipRequestProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    if (!group.operations) {
      return;
    }

    cache.modify({
      fields: { hasRequestedMembership: () => false },
      id: cache.identify(group.operations)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    toast.success("Request cancelled");
  };

  const onError = (error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [cancelGroupMembershipRequest] =
    useCancelGroupMembershipRequestMutation({
      onCompleted: async ({ cancelGroupMembershipRequest }) => {
        if (
          cancelGroupMembershipRequest.__typename ===
          "CancelGroupMembershipRequestResponse"
        ) {
          return onCompleted();
        }

        return await handleTransactionLifecycle({
          transactionData: cancelGroupMembershipRequest,
          onCompleted,
          onError
        });
      },
      onError
    });

  const handleCancelGroupMembershipRequest = async () => {
    setIsSubmitting(true);

    return await cancelGroupMembershipRequest({
      variables: { request: { group: group.address } }
    });
  };

  return (
    <Button
      aria-label="Cancel Request"
      disabled={isSubmitting}
      loading={isSubmitting}
      onClick={handleCancelGroupMembershipRequest}
      size={small ? "sm" : "md"}
      outline
    >
      Cancel Request
    </Button>
  );
};

export default CancelGroupMembershipRequest;
