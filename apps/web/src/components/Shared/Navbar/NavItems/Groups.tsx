import { UserGroupIcon } from "@heroicons/react/24/outline";
import { memo } from "react";
import cn from "@/helpers/cn";

interface GroupsProps {
  className?: string;
}

const Groups = ({ className = "" }: GroupsProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center space-x-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
    >
      <UserGroupIcon className="size-4" />
      <div>Groups</div>
    </div>
  );
};

export default memo(Groups);
