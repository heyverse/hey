import type { EventMetadataFragment } from "@hey/indexer";
import dayjs from "dayjs";
import { Card, H6 } from "@/components/Shared/UI";
import stopEventPropagation from "@/helpers/stopEventPropagation";

interface EventProps {
  metadata: EventMetadataFragment;
}

const Event = ({ metadata }: EventProps) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    stopEventPropagation(event);
  };

  return (
    <Card className="mt-3 space-y-1 p-3" forceRounded>
      {metadata.title ? <H6>{metadata.title}</H6> : null}
      <div className="text-gray-500 text-sm dark:text-gray-400">
        {dayjs(metadata.startsAt).format("MMM D, YYYY h:mm A")} -{" "}
        {dayjs(metadata.endsAt).format("MMM D, YYYY h:mm A")}
      </div>
      {metadata.location?.physical ? (
        <div className="text-gray-500 text-sm dark:text-gray-400">
          {metadata.location.physical}
        </div>
      ) : null}
      {metadata.location?.virtual ? (
        <a
          className="block text-indigo-500 text-sm"
          href={metadata.location.virtual}
          onClick={handleClick}
          rel="noreferrer noopener"
          target="_blank"
        >
          {metadata.location.virtual}
        </a>
      ) : null}
    </Card>
  );
};

export default Event;
