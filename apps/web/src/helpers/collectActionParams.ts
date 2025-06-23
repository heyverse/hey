import type { PostActionConfigInput } from "@hey/indexer";
import type { CollectActionType } from "@hey/types/hey";

const collectActionParams = (
  collectAction: CollectActionType
): PostActionConfigInput | null => {
  const { payToCollect, collectLimit, endsAt } = collectAction;

  return {
    simpleCollect: { collectLimit, endsAt, payToCollect }
  };
};

export default collectActionParams;
