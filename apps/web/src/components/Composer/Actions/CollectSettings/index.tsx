import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Modal, Tooltip } from "@/components/Shared/UI";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { usePostLicenseStore } from "@/store/non-persisted/post/usePostLicenseStore";
import CollectForm from "./CollectForm";

const CollectSettings = () => {
  const { reset } = useCollectActionStore((state) => state);
  const { setLicense } = usePostLicenseStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip content="Collect" placement="top" withDelay>
        <button
          aria-label="Collect Module"
          className="rounded-full outline-offset-8"
          onClick={() => setShowModal(!showModal)}
          type="button"
        >
          <ShoppingBagIcon className="size-5" />
        </button>
      </Tooltip>
      <Modal
        onClose={() => {
          setShowModal(false);
          setLicense(null);
          reset();
        }}
        show={showModal}
        title="Collect Settings"
      >
        <CollectForm setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default CollectSettings;
