import Loader from "@/components/Shared/Loader";
import { tokens } from "@hey/data/tokens";
import { isRepost } from "@hey/helpers/postHelpers";
import type {
  AnyPostFragment,
  SimpleCollectActionFragment
} from "@hey/indexer";
import { useCollectActionQuery } from "@hey/indexer";
import { useCounter } from "@uidotdev/usehooks";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import CollectActionBody from "./CollectActionBody";

interface CollectActionDataProps {
  post: AnyPostFragment;
  setShowCollectModal: Dispatch<SetStateAction<boolean>>;
}

const CollectActionData = ({
  post,
  setShowCollectModal
}: CollectActionDataProps) => {
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);
  const targetPost = isRepost(post) ? post.repostOf : post;
  const [collects, { increment }] = useCounter(targetPost.stats.collects);

  const { data, loading } = useCollectActionQuery({
    variables: { request: { post: post.id } }
  });

  if (loading) {
    return <Loader className="my-10" />;
  }

  const targetAction =
    data?.post?.__typename === "Post"
      ? data?.post.actions.find((a) => a.__typename === "SimpleCollectAction")
      : data?.post?.__typename === "Repost"
        ? data?.post.repostOf?.actions.find(
            (a) => a.__typename === "SimpleCollectAction"
          )
        : null;

  if (!targetAction) {
    return null;
  }

  const collectAction = targetAction as SimpleCollectActionFragment;
  const endTimestamp = collectAction.endsAt;
  const collectLimit = Number(collectAction.collectLimit);
  const amount = Number.parseFloat(
    collectAction.payToCollect?.price?.value || "0"
  );
  const currency = collectAction.payToCollect?.price?.asset?.symbol;
  const recipients = collectAction.payToCollect?.recipients || [];
  const percentageCollected = (collects / collectLimit) * 100;
  const enabledTokens = tokens.map((t) => t.symbol);
  const isTokenEnabled = enabledTokens.includes(currency || "");
  const isSaleEnded = endTimestamp
    ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
    : false;
  const isAllCollected = collectLimit ? collects >= collectLimit : false;

  return (
    <CollectActionBody
      targetPost={targetPost}
      collectAction={collectAction}
      collects={collects}
      collectLimit={collectLimit}
      percentageCollected={percentageCollected}
      currency={currency}
      amount={amount}
      recipients={recipients}
      isTokenEnabled={isTokenEnabled}
      isSaleEnded={isSaleEnded}
      isAllCollected={isAllCollected}
      endTimestamp={endTimestamp}
      setShowCollectModal={setShowCollectModal}
      showCollectorsModal={showCollectorsModal}
      setShowCollectorsModal={setShowCollectorsModal}
      increment={increment}
    />
  );
};

export default CollectActionData;
