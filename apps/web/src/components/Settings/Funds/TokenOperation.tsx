import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Input, Modal } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";

interface TokenOperationProps {
  useMutationHook: any;
  buildRequest: (value: string) => any;
  resultKey: string;
  buttonLabel: string;
  title: string;
  successMessage: string;
  value: string;
  refetch: () => void;
}

const TokenOperation = ({
  useMutationHook,
  buildRequest,
  resultKey,
  buttonLabel,
  title,
  successMessage,
  value,
  refetch
}: TokenOperationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();

  const onCompleted = async (hash: string) => {
    setShowModal(false);
    await waitForTransactionToComplete(hash);
    setIsSubmitting(false);
    refetch();
    toast.success(successMessage);
  };

  const onError = (error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [mutate] = useMutationHook({
    onCompleted: async (data: any) => {
      const result = data?.[resultKey];
      if (result?.__typename === "InsufficientFunds") {
        return onError({ message: "Insufficient funds" });
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: result
      });
    },
    onError
  });

  const handleSubmit = () => {
    setIsSubmitting(true);

    return mutate({ variables: { request: buildRequest(inputValue) } });
  };

  return (
    <>
      <Button
        disabled={isSubmitting || inputValue === "0"}
        loading={isSubmitting}
        onClick={() => setShowModal(true)}
        outline
        size="sm"
      >
        {buttonLabel}
      </Button>
      <Modal onClose={() => setShowModal(false)} show={showModal} title={title}>
        <div className="p-5">
          <div className="mb-5 flex items-center gap-2">
            <Input
              onChange={(e) => setInputValue(e.target.value)}
              type="number"
              value={inputValue}
            />
            <Button onClick={() => setInputValue(value)} size="lg">
              Max
            </Button>
          </div>
          <Button
            className="w-full"
            disabled={isSubmitting || !inputValue || inputValue === "0"}
            loading={isSubmitting}
            onClick={handleSubmit}
            size="lg"
          >
            {title}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TokenOperation;
