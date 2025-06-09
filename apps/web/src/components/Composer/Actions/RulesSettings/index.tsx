import { Modal, Tooltip } from "@/components/Shared/UI";
import { GlobeAmericasIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Rules from "./Rules";

const RulesSettings = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip content="Rules" placement="top" withDelay>
        <button
          aria-label="Rules"
          className="rounded-full outline-offset-8"
          onClick={() => setShowModal(!showModal)}
          type="button"
        >
          <GlobeAmericasIcon className="size-5" />
        </button>
      </Tooltip>
      <Modal onClose={() => setShowModal(false)} show={showModal} title="Rules">
        <Rules setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default RulesSettings;
