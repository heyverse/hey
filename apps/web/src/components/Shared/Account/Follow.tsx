import { Button } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useApolloClient } from "@apollo/client";
import { Errors } from "@hey/data/errors";
import { type AccountFragment, useFollowMutation } from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";

interface FollowProps {
  onFollow?: () => void;
  buttonClassName: string;
  account: AccountFragment;
  small: boolean;
  title?: string;
}

const Follow = ({
  onFollow,
  buttonClassName,
  account,
  small,
  title = "Follow"
}: FollowProps) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { setShowAuthModal } = useAuthModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    if (!account.operations) {
      return;
    }

    cache.modify({
      fields: { isFollowedByMe: () => true },
      id: cache.identify(account.operations)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    onFollow?.();
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [follow] = useFollowMutation({
    onCompleted: async ({ follow }) => {
      if (follow.__typename === "FollowResponse") {
        return onCompleted();
      }

      if (follow.__typename === "AccountFollowOperationValidationFailed") {
        return onError({ message: follow.reason });
      }

      return await handleTransactionLifecycle({
        transactionData: follow,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleCreateFollow = async () => {
    if (!currentAccount) {
      return setShowAuthModal(true);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);

    return await follow({
      variables: { request: { account: account.address } }
    });
  };

  return (
    <Button
      aria-label={title}
      className={buttonClassName}
      disabled={isSubmitting}
      loading={isSubmitting}
      onClick={handleCreateFollow}
      outline
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Follow;
