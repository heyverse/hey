import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Events } from "@hey/data/events";
import { useUnwrapTokensMutation } from "@hey/indexer";
import { Button, Input, Modal } from "@hey/ui";
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
  const [showModal, setShowModal] = useState(false);
  const [valueToUnwrap, setValueToUnwrap] = useState(value);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    trackEvent(Events.Account.UnwrapTokens);
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
        disabled={isSubmitting}
      >
        Unwrap
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
