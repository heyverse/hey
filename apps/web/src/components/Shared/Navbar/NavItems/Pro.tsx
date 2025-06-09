import { Tooltip } from "@/components/Shared/UI";
import { useProModalStore } from "@/store/non-persisted/modal/useProModalStore";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

const Pro = () => {
  const { setShowProModal } = useProModalStore();

  return (
    <button onClick={() => setShowProModal(true)} type="button">
      <Tooltip content="Pro">
        <CheckBadgeIcon className="size-6" />
      </Tooltip>
    </button>
  );
};

export default Pro;
