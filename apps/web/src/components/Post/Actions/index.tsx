import { memo } from "react";
import CollectAction from "@/components/Post/OpenAction/CollectAction";
import SmallCollectButton from "@/components/Post/OpenAction/CollectAction/SmallCollectButton";
import TipAction from "@/components/Post/OpenAction/TipAction";
import { usePostContext } from "@/contexts/PostContext";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import Comment from "./Comment";
import Like from "./Like";
import ShareMenu from "./Share";

interface PostActionsProps {
  showCount?: boolean;
}

const PostActions = ({ showCount = false }: PostActionsProps) => {
  const { post, targetPost, canAct } = usePostContext();
  // Type assertion to handle AnyPostFragment vs PostFragment type difference
  const targetPostTyped = targetPost as any;

  return (
    <span
      className="mt-3 flex w-full flex-wrap items-center justify-between gap-3"
      onClick={stopEventPropagation}
    >
      <span className="flex items-center gap-x-6">
        <Comment post={targetPostTyped} showCount={showCount} />
        <ShareMenu post={post} showCount={showCount} />
        <Like post={targetPostTyped} showCount={showCount} />
        {canAct && !showCount ? <CollectAction post={targetPostTyped} /> : null}
        <TipAction post={targetPostTyped} showCount={showCount} />
      </span>
      {canAct ? <SmallCollectButton post={targetPostTyped} /> : null}
    </span>
  );
};

export default memo(PostActions);
