import cn from "@/helpers/cn";
import { MenuItem } from "@headlessui/react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { PostFragment } from "@hey/indexer";
import { toast } from "sonner";

interface ShareProps {
  post: PostFragment;
}

const Share = ({ post }: ShareProps) => {
  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          `${location.origin}/posts/${post.slug}`
        );
        toast.success("Copied to clipboard!");
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="size-4" />
        <div>Share</div>
      </div>
    </MenuItem>
  );
};

export default Share;
