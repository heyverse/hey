import { Button, Input, Modal } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";
import { WRAPPED_NATIVE_TOKEN_SYMBOL } from "@hey/data/constants";
import { useWrapTokensMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";
import { toast } from "sonner";

interface WrapProps {
  value: string;
  refetch: () => void;
}

const Wrap = ({ value, refetch }: WrapProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [valueToWrap, setValueToWrap] = useState(value);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();

  const onCompleted = async (hash: string) => {
    setShowModal(false);
    await waitForTransactionToComplete(hash);
    setIsSubmitting(false);
    refetch();
    toast.success("Wrap Successful");
  };

  const onError = (error: ApolloClientError) => {
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

  const handleWrap = () => {
    setIsSubmitting(true);

    return wrapTokens({
      variables: { request: { amount: valueToWrap } }
    });
  };

  return (
    <>
      <Button
        size="sm"
        outline
        onClick={() => setShowModal(true)}
        disabled={isSubmitting || valueToWrap === "0"}
        loading={isSubmitting}
      >
        Wrap to {WRAPPED_NATIVE_TOKEN_SYMBOL}
      </Button>
      <Modal title="Wrap" show={showModal} onClose={() => setShowModal(false)}>
        <div className="p-5">
          <div className="mb-5 flex items-center gap-2">
            <Input
              type="number"
              value={valueToWrap}
              onChange={(e) => setValueToWrap(e.target.value)}
            />
            <Button size="lg" onClick={() => setValueToWrap(value)}>
              Max
            </Button>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleWrap}
            disabled={isSubmitting || !valueToWrap || valueToWrap === "0"}
            loading={isSubmitting}
          >
            Wrap
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Wrap;
