import { Button, Input, Modal } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import usePollTransactionStatus from "@/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { NATIVE_TOKEN_SYMBOL } from "@hey/data/constants";
import { useUnwrapTokensMutation } from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";

interface UnwrapProps {
  value: string;
  refetch: () => void;
}

const Unwrap = ({ value, refetch }: UnwrapProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [valueToUnwrap, setValueToUnwrap] = useState(value);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    setShowModal(false);
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

  const handleUnwrap = () => {
    setIsSubmitting(true);

    return unwrapTokens({
      variables: { request: { amount: valueToUnwrap } }
    });
  };

  return (
    <>
      <Button
        size="sm"
        outline
        onClick={() => setShowModal(true)}
        disabled={isSubmitting || valueToUnwrap === "0"}
      >
        Unwrap to {NATIVE_TOKEN_SYMBOL}
      </Button>
      <Modal
        title="Unwrap"
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="p-5">
          <div className="mb-5 flex items-center gap-2">
            <Input
              type="number"
              value={valueToUnwrap}
              onChange={(e) => setValueToUnwrap(e.target.value)}
            />
            <Button size="lg" onClick={() => setValueToUnwrap(value)}>
              Max
            </Button>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleUnwrap}
            disabled={isSubmitting || !valueToUnwrap || valueToUnwrap === "0"}
          >
            Unwrap
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Unwrap;
