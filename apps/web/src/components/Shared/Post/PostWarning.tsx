import { memo } from "react";
import { Card } from "@/components/Shared/UI";

interface PostWarningProps {
  message: string;
}

const PostWarning = ({ message }: PostWarningProps) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800 m-5" forceRounded>
      <div className="px-4 py-3 text-sm">{message}</div>
    </Card>
  );
};

export default memo(PostWarning);
