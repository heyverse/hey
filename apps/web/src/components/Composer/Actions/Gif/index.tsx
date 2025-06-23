import { Modal, Tooltip } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import { GifIcon } from "@heroicons/react/24/outline";
import type { IGif } from "@hey/types/giphy";
import { useState } from "react";
import GifSelector from "./GifSelector";

interface GifProps {
  setGifAttachment: (gif: IGif) => void;
}

const Gif = ({ setGifAttachment }: GifProps) => {
  const { attachments } = usePostAttachmentStore();
  const [showModal, setShowModal] = useState(false);
  const disable =
    attachments.length > 0 &&
    (attachments.some((attachment) => attachment.type === "Image")
      ? attachments.length >= 4
      : true);

  return (
    <>
      <Tooltip content="GIF" placement="top" withDelay>
        <button
          aria-label="GIF"
          className={cn("rounded-full outline-offset-8", {
            "opacity-50": disable
          })}
          disabled={disable}
          onClick={() => setShowModal(!showModal)}
          type="button"
        >
          <GifIcon className="size-5" />
        </button>
      </Tooltip>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="Select GIF"
      >
        <GifSelector
          setGifAttachment={setGifAttachment}
          setShowModal={setShowModal}
        />
      </Modal>
    </>
  );
};

export default Gif;
