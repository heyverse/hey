import { BeakerIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { BANNER_IDS, PERMISSIONS } from "@hey/data/constants";
import {
  useAddPostNotInterestedMutation,
  useJoinGroupMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button, Card, H5 } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import logEvent from "@/helpers/logEvent";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useProStore } from "@/store/persisted/useProStore";

const BetaBanner = () => {
  const { currentAccount } = useAccountStore();
  const { proBannerDismissed, setProBannerDismissed } = useProStore();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCompleted = async (hash: string) => {
    await waitForTransactionToComplete(hash);
    location.reload();
  };

  const onError = useCallback((error: ApolloClientError) => {
    errorToast(error);
  }, []);

  const [dismissProBanner, { loading }] = useAddPostNotInterestedMutation({
    onCompleted: () => {
      toast.success("Dismissed");
      setProBannerDismissed(true);
      void logEvent("Dismiss Pro Banner");
    },
    onError,
    variables: { request: { post: BANNER_IDS.PRO } }
  });

  const [joinGroup] = useJoinGroupMutation({
    onCompleted: async ({ joinGroup }) => {
      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: joinGroup
      });
    },
    onError
  });

  if (!currentAccount?.hasSubscribed) {
    return null;
  }

  if (currentAccount?.isBeta || proBannerDismissed) {
    return null;
  }

  const handleDismissProBanner = async () => {
    return await dismissProBanner();
  };

  const handleJoinBeta = async () => {
    setIsSubmitting(true);

    return await joinGroup({
      variables: { request: { group: PERMISSIONS.BETA } }
    });
  };

  return (
    <Card className="relative space-y-2">
      <button
        className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600"
        disabled={loading}
        onClick={handleDismissProBanner}
        type="button"
      >
        <XCircleIcon className="size-5" />
      </button>
      <div className="m-5">
        <div className="flex items-center gap-2">
          <BeakerIcon className="size-5 text-green-500" />
          <H5>Join Hey Beta</H5>
        </div>
        <div className="mb-5 text-sm">
          Get your badge and access exclusive features.
        </div>
        <Button
          className="w-full"
          loading={isSubmitting}
          onClick={handleJoinBeta}
          outline
        >
          Get Beta Access
        </Button>
      </div>
    </Card>
  );
};

export default BetaBanner;
