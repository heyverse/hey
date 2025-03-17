import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Events } from "@hey/data/events";
import { useWrapTokensMutation } from "@hey/indexer";
import { Button } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import usePollTransactionStatus from "src/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";

interface WrapProps {
  value: string;
  refetch: () => void;
}

const Wrap: FC<WrapProps> = ({ value, refetch }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    trackEvent(Events.Account.WrapTokens);
    toast.success("Wrap Initiated");
    pollTransactionStatus(hash, () => {
      refetch();
      toast.success("Wrap Successful");
    });
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [wrapTokens] = useWrapTokensMutation({
    onCompleted: async ({ wrapTokens }) => {
      if (wrapTokens.__typename === "InsufficientFunds") {
        return onError({ message: "Insufficient funds" });
      }

      return await handleTransactionLifecycle({
        transactionData: wrapTokens,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleWrap = (value: string) => {
    setIsSubmitting(true);

    return wrapTokens({
      variables: { request: { amount: value } }
    });
  };

  return (
    <Button
      size="sm"
      outline
      onClick={() => handleWrap(value)}
      disabled={isSubmitting}
    >
      Wrap
    </Button>
  );
};

export default Wrap;
