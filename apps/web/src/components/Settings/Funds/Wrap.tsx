import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Events } from "@hey/data/events";
import { useWrapTokensMutation } from "@hey/indexer";
import { Button, Input, Modal } from "@hey/ui";
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
  const [showModal, setShowModal] = useState(false);
  const [valueToWrap, setValueToWrap] = useState(value);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    trackEvent(Events.Account.WrapTokens);
    setShowModal(false);
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
        disabled={isSubmitting}
      >
        Wrap
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
          >
            Wrap
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Wrap;
