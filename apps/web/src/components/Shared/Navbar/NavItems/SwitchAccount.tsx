import cn from "@/helpers/cn";
import { useSwitchAccountModalStore } from "@/store/non-persisted/modal/useSwitchAccountModalStore";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

interface SwitchAccountProps {
  className?: string;
}

const SwitchAccount = ({ className = "" }: SwitchAccountProps) => {
  const { setShowSwitchAccountModal } = useSwitchAccountModalStore();

  return (
    <button
      className={cn(
        "flex w-full items-center space-x-1.5 px-2 py-1.5 text-left text-gray-700 text-sm dark:text-gray-200",
        className
      )}
      onClick={() => setShowSwitchAccountModal(true)}
      type="button"
    >
      <ArrowsRightLeftIcon className="size-4" />
      <span>Switch account</span>
    </button>
  );
};

export default SwitchAccount;
