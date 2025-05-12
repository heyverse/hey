import { Modal, Tooltip } from "@/components/Shared/UI";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const Pro = () => {
  const [showProModal, setShowProModal] = useState(false);

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
        <div className="m-5">Coming soon</div>
      </Modal>
    </>
  );
};

export default Pro;
