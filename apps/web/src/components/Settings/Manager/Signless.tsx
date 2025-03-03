import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { APP_NAME } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import { useEnableSignlessMutation } from "@hey/indexer";
import { Button, Card, CardHeader } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";

const Signless: FC = () => {
  const { isSuspended } = useAccountStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const onCompleted = () => {
    setIsSubmitting(false);
    trackEvent(Events.Account.UpdateSettings, { type: "enable_signless" });
    toast.success("Signless enabled");
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [enableSignless] = useEnableSignlessMutation({
    onCompleted: async ({ enableSignless }) => {
      return await handleTransactionLifecycle({
        transactionData: enableSignless,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleToggleSignless = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);

    return await enableSignless();
  };

  return (
    <Card>
      <CardHeader
        body={`You can enable Signless to interact with ${APP_NAME} without signing any of your transactions.`}
        title="Enable signless transactions"
      />
      <div className="m-5">
        <Button
          className="mr-auto"
          disabled={isSubmitting}
          onClick={handleToggleSignless}
          variant="primary"
        >
          Enable
        </Button>
      </div>
    </Card>
  );
};

export default Signless;
