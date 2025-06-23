import { memo, type ReactNode } from "react";
import { Card } from "@/components/Shared/UI";
import cn from "@/helpers/cn";

interface EmptyStateProps {
  hideCard?: boolean;
  icon: ReactNode;
  message: ReactNode;
  className?: string;
}

const EmptyState = ({
  hideCard = false,
  icon,
  message,
  className = ""
}: EmptyStateProps) => {
  return (
    <Card
      className={cn(
        { "!bg-transparent !shadow-none !border-0": hideCard },
        className
      )}
    >
      <div className="grid justify-items-center space-y-2 p-5">
        <div>{icon}</div>
        <div>{message}</div>
      </div>
    </Card>
  );
};

export default memo(EmptyState);
