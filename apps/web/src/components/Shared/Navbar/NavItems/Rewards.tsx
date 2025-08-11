import { GiftIcon } from "@heroicons/react/24/outline";
import { memo } from "react";
import cn from "@/helpers/cn";

interface RewardsProps {
  className?: string;
}

const Rewards = ({ className = "" }: RewardsProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center space-x-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
    >
      <GiftIcon className="size-4" />
      <div>Rewards</div>
    </div>
  );
};

export default memo(Rewards);
