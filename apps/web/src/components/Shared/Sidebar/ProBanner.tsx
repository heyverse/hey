import { Button, Card, H5 } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import hasSubscribed from "@/helpers/hasSubscribed";
import { useProModalStore } from "@/store/non-persisted/modal/useProModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useProStore } from "@/store/persisted/useProStore";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { BANNER_IDS } from "@hey/data/constants";
import { useAddPostNotInterestedMutation } from "@hey/indexer";
import { toast } from "sonner";

const ProBanner = () => {
  const { currentAccount } = useAccountStore();
  const { proBannerDismissed, setProBannerDismissed } = useProStore();
  const { setShowProModal } = useProModalStore();

  const onError = (error: Error) => {
    errorToast(error);
  };

  const [dismissProBanner, { loading }] = useAddPostNotInterestedMutation({
    onCompleted: () => {
      toast.success("Dismissed");
      setProBannerDismissed(true);
    },
    onError,
    variables: { request: { post: BANNER_IDS.PRO } }
  });

  if ((currentAccount && hasSubscribed(currentAccount)) || proBannerDismissed) {
    return null;
  }

  const handleDismissProBanner = async () => {
    return await dismissProBanner();
  };

  return (
    <Card className="relative space-y-2">
      <button
        className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600"
        type="button"
        onClick={handleDismissProBanner}
        disabled={loading}
      >
        <XCircleIcon className="size-5" />
      </button>
      <div className="m-5">
        <div className="flex items-center gap-2">
          <CheckBadgeIcon className="size-5 text-brand-500" />
          <H5>Subscribe to Hey Pro</H5>
        </div>
        <div className="mb-5 text-sm">
          Get badge and access to exclusive features.
        </div>
        <Button
          className="w-full"
          outline
          onClick={() => setShowProModal(true)}
        >
          Subscribe now
        </Button>
      </div>
    </Card>
  );
};

export default ProBanner;
