import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Events } from "@hey/data/events";
import { useWithdrawMutation } from "@hey/indexer";
import { Button } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import usePollTransactionStatus from "src/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import type { Address } from "viem";

interface WithdrawProps {
  currency?: Address;
  value: string;
  refetch: () => void;
}

const Withdraw: FC<WithdrawProps> = ({ currency, value, refetch }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    trackEvent(Events.Account.WithdrawFunds);
    toast.success("Withdrawal Initiated");
    pollTransactionStatus(hash, () => {
      refetch();
      toast.success("Withdrawal Successful");
    });
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [withdraw] = useWithdrawMutation({
    onCompleted: async ({ withdraw }) => {
      if (withdraw.__typename === "InsufficientFunds") {
        return onError({ message: "Insufficient funds" });
      }

      return await handleTransactionLifecycle({
        transactionData: withdraw,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleWithdraw = (currency: Address | undefined, value: string) => {
    setIsSubmitting(true);

    return withdraw({
      variables: {
        request: {
          ...(currency ? { erc20: { currency, value } } : { native: value })
        }
      }
    });
  };

  return (
    <Button
      size="sm"
      outline
      onClick={() => handleWithdraw(currency, value)}
      disabled={isSubmitting}
    >
      Withdraw
    </Button>
  );
};

export default Withdraw;
