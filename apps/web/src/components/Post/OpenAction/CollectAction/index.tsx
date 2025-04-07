import { Modal, Tooltip } from "@/components/Shared/UI";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import humanize from "@hey/helpers/humanize";
import nFormatter from "@hey/helpers/nFormatter";
import type { PostFragment } from "@hey/indexer";
import plur from "plur";
import { useState } from "react";
import CollectActionBody from "./CollectActionBody";

interface CollectActionProps {
  post: PostFragment;
}

const CollectAction = ({ post }: CollectActionProps) => {
  const [showCollectModal, setShowCollectModal] = useState(false);
  const { collects } = post.stats;

  return (
    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-200">
      <button
        aria-label="Collect"
        className="rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        onClick={() => setShowCollectModal(true)}
        type="button"
      >
        <Tooltip
          content={`${humanize(collects)} ${plur("Collect", collects)}`}
          placement="top"
          withDelay
        >
          <ShoppingBagIcon className="w-[15px] sm:w-[18px]" />
        </Tooltip>
      </button>
      {collects > 0 ? (
        <span className="text-[11px] sm:text-xs">{nFormatter(collects)}</span>
      ) : null}
      <Modal
        onClose={() => setShowCollectModal(false)}
        show={showCollectModal}
        title="Collect"
      >
        <CollectActionBody
          post={post}
          setShowCollectModal={setShowCollectModal}
        />
      </Modal>
    </div>
  );
};

export default CollectAction;
