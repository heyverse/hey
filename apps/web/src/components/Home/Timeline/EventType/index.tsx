import type { TimelineItemFragment } from "@hey/indexer";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import Combined from "./Combined";
import Reposted from "./Reposted";

const getCanCombined = (aggregations: number[]) => {
  // show combined reactions if more than 2 items in aggregations
  return aggregations.filter((n) => n > 0).length > 1;
};

interface ActionTypeProps {
  timelineItem: TimelineItemFragment;
}

const ActionType = ({ timelineItem }: ActionTypeProps) => {
  const { reposts } = timelineItem;
  const canCombined = getCanCombined([reposts?.length || 0]);

  return (
    <span onClick={stopEventPropagation}>
      {canCombined ? (
        <Combined timelineItem={timelineItem} />
      ) : reposts?.length ? (
        <Reposted reposts={reposts} />
      ) : null}
    </span>
  );
};

export default ActionType;
