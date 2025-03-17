import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Events } from "@hey/data/events";
import { useUnwrapTokensMutation } from "@hey/indexer";
import { Button } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import usePollTransactionStatus from "src/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";

interface UnwrapProps {
  value: string;
  refetch: () => void;
}

const Unwrap: FC<UnwrapProps> = ({ value, refetch }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    trackEvent(Events.Account.UnwrapTokens);
    toast.success("Unwrap Initiated");
    pollTransactionStatus(hash, () => {
      refetch();
      toast.success("Unwrap Successful");
    });
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [unwrapTokens] = useUnwrapTokensMutation({
    onCompleted: async ({ unwrapTokens }) => {
      if (unwrapTokens.__typename === "InsufficientFunds") {
        return onError({ message: "Insufficient funds" });
      }

      return await handleTransactionLifecycle({
        transactionData: unwrapTokens,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleUnwrap = (value: string) => {
    setIsSubmitting(true);

    return unwrapTokens({
      variables: { request: { amount: value } }
    });
  };

  return (
    <Button
      size="sm"
      outline
      onClick={() => handleUnwrap(value)}
      disabled={isSubmitting}
    >
      Unwrap
    </Button>
  );
};

export default Unwrap;
