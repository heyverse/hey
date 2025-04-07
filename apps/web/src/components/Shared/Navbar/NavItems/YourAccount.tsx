import cn from "@/helpers/cn";
import { UserIcon } from "@heroicons/react/24/outline";

interface YourAccountProps {
  className?: string;
}

const YourAccount = ({ className = "" }: YourAccountProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center space-x-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
    >
      <UserIcon className="size-4" />
      <div>Your account</div>
    </div>
  );
};

export default YourAccount;
