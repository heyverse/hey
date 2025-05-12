import { SparklesIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "./UI";

const ProFeatureBadge = () => {
  return (
    <Tooltip content="Subscribe to Pro" placement="top">
      <SparklesIcon className="size-5" />
    </Tooltip>
  );
};

export default ProFeatureBadge;
