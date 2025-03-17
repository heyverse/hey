import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Events } from "@hey/data/events";
import { useWithdrawMutation } from "@hey/indexer";
import { Button, Input, Modal } from "@hey/ui";
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
  const [showModal, setShowModal] = useState(false);
  const [valueToWithdraw, setValueToWithdraw] = useState(value);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    trackEvent(Events.Account.WithdrawFunds);
    setShowModal(false);
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

  const handleWithdraw = () => {
    setIsSubmitting(true);

    return withdraw({
      variables: {
        request: {
          ...(currency
            ? { erc20: { currency, value: valueToWithdraw } }
            : { native: valueToWithdraw })
        }
      }
    });
  };

  return (
    <>
      <Button
        size="sm"
        outline
        onClick={() => setShowModal(true)}
        disabled={isSubmitting}
      >
        Withdraw
      </Button>
      <Modal
        title="Withdraw"
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="p-5">
          <div className="mb-5 flex items-center gap-2">
            <Input
              type="number"
              value={valueToWithdraw}
              onChange={(e) => setValueToWithdraw(e.target.value)}
            />
            <Button size="lg" onClick={() => setValueToWithdraw(value)}>
              Max
            </Button>
          </div>
          <Button
            className="w-full"
            onClick={handleWithdraw}
            disabled={
              isSubmitting || !valueToWithdraw || valueToWithdraw === "0"
            }
          >
            Withdraw
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Withdraw;
