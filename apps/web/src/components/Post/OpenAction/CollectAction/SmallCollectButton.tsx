import type { PostFragment } from "@hey/indexer";
import { useState } from "react";
import { Button, Modal } from "@/components/Shared/UI";
import CollectActionBody from "./CollectActionBody";

interface SmallCollectButtonProps {
  post: PostFragment;
}

const SmallCollectButton = ({ post }: SmallCollectButtonProps) => {
  const [showCollectModal, setShowCollectModal] = useState(false);
  const hasSimpleCollected = post.operations?.hasSimpleCollected;

  return (
    <>
      <Button
        onClick={() => setShowCollectModal(true)}
        outline={!hasSimpleCollected}
        size="sm"
      >
        {hasSimpleCollected ? "Collected" : "Collect"}
      </Button>
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
    </>
  );
};

export default SmallCollectButton;
