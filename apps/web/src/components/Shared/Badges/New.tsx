import { SparklesIcon } from "@heroicons/react/24/solid";
import { Badge } from "@hey/ui";

const New = () => {
  return (
    <Badge className="flex items-center space-x-1 border-blue-600 bg-blue-500">
      <SparklesIcon className="size-3" />
      <div>New</div>
    </Badge>
  );
};

export default New;
