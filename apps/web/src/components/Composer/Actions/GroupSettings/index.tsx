import { Image, Modal, Tooltip } from "@/components/Shared/UI";
import { usePostGroupStore } from "@/store/non-persisted/post/usePostGroupStore";
import { HomeIcon } from "@heroicons/react/24/outline";
import getAvatar from "@hey/helpers/getAvatar";
import { useState } from "react";
import GroupSelector from "./GroupSelector";

const GroupSettings = () => {
  const { group } = usePostGroupStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip content="Group" placement="top">
        <button
          aria-label="Group"
          className="rounded-full outline-offset-8"
          onClick={() => setShowModal(!showModal)}
          type="button"
        >
          {group ? (
            <Image
              alt={group.address}
              className="size-5"
              src={getAvatar(group)}
            />
          ) : (
            <HomeIcon className="size-5" />
          )}
        </button>
      </Tooltip>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="Select Group"
      >
        <GroupSelector setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default GroupSettings;
