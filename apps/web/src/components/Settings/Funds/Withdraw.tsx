import { Button, Input, Modal } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import usePollTransactionStatus from "@/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useWithdrawMutation } from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";
import type { Address } from "viem";

interface WithdrawProps {
  currency?: Address;
  value: string;
  refetch: () => void;
}

const Withdraw = ({ currency, value, refetch }: WithdrawProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [valueToWithdraw, setValueToWithdraw] = useState(value);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
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
        disabled={isSubmitting || valueToWithdraw === "0"}
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
            size="lg"
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
