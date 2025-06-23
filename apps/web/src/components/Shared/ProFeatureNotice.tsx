import { SparklesIcon } from "@heroicons/react/24/outline";
import cn from "@/helpers/cn";
import { useProModalStore } from "@/store/non-persisted/modal/useProModalStore";

interface ProFeatureNoticeProps {
  feature: string;
  className?: string;
}

const ProFeatureNotice = ({ feature, className }: ProFeatureNoticeProps) => {
  const { setShowProModal } = useProModalStore();

  return (
    <div
      className={cn(
        "flex items-center gap-x-2 font-semibold text-gray-500 text-sm",
        className
      )}
    >
      <SparklesIcon className="size-4" />
      <span>
        <button
          className="underline"
          onClick={() => setShowProModal(true)}
          type="button"
        >
          Upgrade to Pro
        </button>{" "}
        to unlock {feature}
      </span>
    </div>
  );
};

export default ProFeatureNotice;
