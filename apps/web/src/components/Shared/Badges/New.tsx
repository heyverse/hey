import { SparklesIcon } from "@heroicons/react/24/solid";
import { memo } from "react";
import { Badge } from "@/components/Shared/UI";

const New = () => {
  return (
    <Badge className="flex items-center space-x-1 border-blue-600 bg-blue-500">
      <SparklesIcon className="size-3" />
      <div>New</div>
    </Badge>
  );
};

export default memo(New);
