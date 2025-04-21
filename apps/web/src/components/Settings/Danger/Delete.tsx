import { Button, H5, Modal, WarningMessage } from "@/components/Shared/UI";
import useHandleWrongNetwork from "@/hooks/useHandleWrongNetwork";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { BLOCK_EXPLORER_URL, NULL_ADDRESS } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const DeleteSettings = () => {
  const { currentAccount } = useAccountStore();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const handleDelete = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    setIsSubmitting(true);
    await handleWrongNetwork();
    setIsSubmitting(false);
    return toast.success("Feature not implemented yet");
  };

  return (
    <>
      <div className="m-5 space-y-5">
        <div className="space-y-3">
          <H5 className="text-red-500">Delete Lens account</H5>
          <p>
            This will permanently delete your Account NFT on the Lens. You will
            not be able to use any apps built on Lens, including Hey. All your
            data will be wiped out immediately and you won't be able to get it
            back.
          </p>
        </div>
        <H5>What else you should know</H5>
        <div className="divide-y divide-gray-200 text-gray-500 text-sm dark:divide-gray-700 dark:text-gray-200">
          <p className="pb-3">
            You cannot restore your Lens account if it was accidentally or
            wrongfully deleted.
          </p>
          <p className="py-3">
            Some account information may still be available in search engines,
            such as Google or Bing.
          </p>
          <p className="linkify py-3">
            Your account will be transferred to a{" "}
            <Link to={`${BLOCK_EXPLORER_URL}/address/${NULL_ADDRESS}`}>
              null address
            </Link>{" "}
            after deletion.
          </p>
          <p className="py-3 font-bold text-red-500">
            Your @handle will not be available for reuse.
          </p>
        </div>
        <Button
          disabled={isSubmitting}
          loading={isSubmitting}
          onClick={() => setShowWarningModal(true)}
          outline
        >
          Delete your account
        </Button>
      </div>
      <Modal
        onClose={() => setShowWarningModal(false)}
        show={showWarningModal}
        title="Danger zone"
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            message={
              <div className="leading-6">
                Confirm that you have read all consequences and want to delete
                your account anyway
              </div>
            }
            title="Are you sure?"
          />
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            onClick={async () => {
              setShowWarningModal(false);
              await handleDelete();
            }}
            outline
          >
            Yes, delete my account
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteSettings;
