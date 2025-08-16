import { MenuItem } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { PostFragment } from "@hey/indexer";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useDeletePostAlertStore } from "@/store/non-persisted/alert/useDeletePostAlertStore";

interface DeleteProps {
  post: PostFragment;
}

const Delete = ({ post }: DeleteProps) => {
  const { setShowPostDeleteAlert } = useDeletePostAlertStore();

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-red-500 text-sm"
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowPostDeleteAlert(true, post);
      }}
    >
      <div className="flex items-center space-x-2">
        <TrashIcon className="size-4" />
        <div>Delete</div>
      </div>
    </MenuItem>
  );
};

export default Delete;
