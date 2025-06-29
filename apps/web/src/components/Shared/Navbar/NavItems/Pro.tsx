import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@/components/Shared/UI";
import { useProModalStore } from "@/store/non-persisted/modal/useProModalStore";

const Pro = () => {
  const { setShow: setShowProModal } = useProModalStore();

  return (
    <button onClick={() => setShowProModal(true)} type="button">
      <Tooltip content="Pro">
        <CheckBadgeIcon className="size-6" />
      </Tooltip>
    </button>
  );
};

export default Pro;
