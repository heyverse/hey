import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { MenuItem } from "@headlessui/react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import type { PostFragment } from "@hey/indexer";

interface ShareProps {
  post: PostFragment;
}

const Share = ({ post }: ShareProps) => {
  const copyLink = useCopyToClipboard(
    `${location.origin}/posts/${post.slug}`,
    "Copied to clipboard!"
  );

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        copyLink();
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
