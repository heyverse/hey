import cn from "@/helpers/cn";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface ProFeatureNoticeProps {
  feature: string;
  className?: string;
}

const ProFeatureNotice = ({ feature, className }: ProFeatureNoticeProps) => {
  // const { setShowProModal } = useProModalStore();

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
          onClick={() => toast.success("Coming soon")}
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
