import { cva } from "class-variance-authority";
import { memo, type ReactNode } from "react";
import { Card } from "@/components/Shared/UI";

interface EmptyStateProps {
  hideCard?: boolean;
  icon: ReactNode;
  message: ReactNode;
  className?: string;
}

const emptyStateVariants = cva("", {
  defaultVariants: { hideCard: false },
  variants: {
    hideCard: {
      false: "",
      true: "!bg-transparent !shadow-none !border-0"
    }
  }
});

const EmptyState = ({
  hideCard = false,
  icon,
  message,
  className = ""
}: EmptyStateProps) => {
  return (
    <Card className={emptyStateVariants({ className, hideCard })}>
      <div className="grid justify-items-center space-y-2 p-5">
        <div>{icon}</div>
        <div>{message}</div>
      </div>
    </Card>
  );
};

export default memo(EmptyState);
