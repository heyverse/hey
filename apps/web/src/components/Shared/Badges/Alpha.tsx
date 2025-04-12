import { Badge } from "@/components/Shared/UI";
import { PuzzlePieceIcon } from "@heroicons/react/24/outline";

const Alpha = () => {
  return (
    <Badge className="flex items-center space-x-1">
      <PuzzlePieceIcon className="size-3" />
      <span>Alpha 🤫</span>
    </Badge>
  );
};

export default Alpha;
