import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { BANNER_IDS } from "@hey/data/constants";
import { useAddPostNotInterestedMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useCallback } from "react";
import { toast } from "sonner";
import { Button, Card, H5 } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import logEvent from "@/helpers/logEvent";
import { useProModalStore } from "@/store/non-persisted/modal/useProModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useProStore } from "@/store/persisted/useProStore";

const ProBanner = () => {
  const { currentAccount } = useAccountStore();
  const { proBannerDismissed, setProBannerDismissed } = useProStore();
  const { setShow: setShowProModal } = useProModalStore();

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

  if (currentAccount?.hasSubscribed || proBannerDismissed) {
    return null;
  }

  const handleDismissProBanner = async () => {
    return await dismissProBanner();
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
          <CheckBadgeIcon className="size-5 text-brand-500" />
          <H5>Join Hey Pro</H5>
        </div>
        <div className="mb-5 text-sm">
          Get your badge and access exclusive features.
        </div>
        <Button
          className="w-full"
          onClick={() => setShowProModal(true)}
          outline
        >
          Subscribe now
        </Button>
      </div>
    </Card>
  );
};

export default ProBanner;
