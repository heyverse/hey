import { Button, Modal, Tooltip } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { SparklesIcon } from "@heroicons/react/24/outline";
import {
  DEFAULT_COLLECT_TOKEN,
  PRO_POST_ID,
  PRO_SUBSCRIPTION_AMOUNT
} from "@hey/data/constants";
import {
  type TippingAmountInput,
  useExecutePostActionMutation
} from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";

const Pro = () => {
  const [showProModal, setShowProModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const onCompleted = () => {
    toast.success("Subscribed to Pro");
  };

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [executeTipAction] = useExecutePostActionMutation({
    onCompleted: async ({ executePostAction }) => {
      if (executePostAction.__typename === "ExecutePostActionResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: executePostAction,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleSubscribe = () => {
    setIsSubmitting(true);

    const tipping: TippingAmountInput = {
      currency: DEFAULT_COLLECT_TOKEN,
      value: PRO_SUBSCRIPTION_AMOUNT.toString()
    };

    return executeTipAction({
      variables: { request: { post: PRO_POST_ID, action: { tipping } } }
    });
  };

  return (
    <>
      <button onClick={() => setShowProModal(true)} type="button">
        <Tooltip content="Pro">
          <SparklesIcon className="size-6" />
        </Tooltip>
      </button>
      <Modal
        show={showProModal}
        onClose={() => setShowProModal(false)}
        title="Pro"
      >
        <div className="m-5">
          <Button
            onClick={handleSubscribe}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Subscribe for ${PRO_SUBSCRIPTION_AMOUNT}/month
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Pro;
