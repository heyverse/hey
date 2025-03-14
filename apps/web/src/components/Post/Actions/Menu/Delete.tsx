import { MenuItem } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { PostFragment } from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useDeletePostAlertStore } from "src/store/non-persisted/alert/useDeletePostAlertStore";

interface DeleteProps {
  post: PostFragment;
}

const Delete: FC<DeleteProps> = ({ post }) => {
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
