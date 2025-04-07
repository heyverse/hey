import cn from "@/helpers/cn";
import { HandRaisedIcon } from "@heroicons/react/24/outline";

interface SupportProps {
  className?: string;
}

const Support = ({ className = "" }: SupportProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center space-x-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
    >
      <HandRaisedIcon className="size-4" />
      <div>Support</div>
    </div>
  );
};

export default Support;
