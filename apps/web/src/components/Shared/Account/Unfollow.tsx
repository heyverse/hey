import { Button } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useApolloClient } from "@apollo/client";
import { Errors } from "@hey/data/errors";
import { type AccountFragment, useUnfollowMutation } from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";

interface UnfollowProps {
  buttonClassName: string;
  account: AccountFragment;
  small: boolean;
  title: string;
}

const Unfollow = ({
  buttonClassName,
  account,
  small,
  title
}: UnfollowProps) => {
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
      fields: { isFollowedByMe: () => false },
      id: cache.identify(account.operations)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [unfollow] = useUnfollowMutation({
    onCompleted: async ({ unfollow }) => {
      if (unfollow.__typename === "UnfollowResponse") {
        return onCompleted();
      }

      if (unfollow.__typename === "AccountFollowOperationValidationFailed") {
        return onError({ message: unfollow.reason });
      }

      return await handleTransactionLifecycle({
        transactionData: unfollow,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleCreateUnfollow = async () => {
    if (!currentAccount) {
      return setShowAuthModal(true);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);
    return await unfollow({
      variables: { request: { account: account.address } }
    });
  };

  return (
    <Button
      aria-label={title}
      className={buttonClassName}
      disabled={isSubmitting}
      onClick={handleCreateUnfollow}
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Unfollow;
