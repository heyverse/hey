import { MenuItem } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { PostFragment } from "@hey/indexer";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useReportPostModalStore } from "@/store/non-persisted/modal/useReportPostModalStore";

interface ReportProps {
  post: PostFragment;
}

const Report = ({ post }: ReportProps) => {
  const { setShowReportPostModal } = useReportPostModalStore();

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
        setShowReportPostModal(true, post.id);
      }}
    >
      <div className="flex items-center space-x-2">
        <ExclamationTriangleIcon className="size-4" />
        <div>Report post</div>
      </div>
    </MenuItem>
  );
};

export default Report;
