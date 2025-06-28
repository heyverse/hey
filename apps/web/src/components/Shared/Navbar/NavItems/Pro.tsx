import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@/components/Shared/UI";
import { useProModal } from "@/store/non-persisted/modal/useProModalStore";

const Pro = () => {
  const { setShowProModal } = useProModal();

  return (
    <button onClick={() => setShowProModal(true)} type="button">
      <Tooltip content="Pro">
        <CheckBadgeIcon className="size-6" />
      </Tooltip>
    </button>
  );
};

export default Pro;
