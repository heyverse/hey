import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { MenuItem } from "@headlessui/react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import type { PostFragment } from "@hey/indexer";

interface CopyPostTextProps {
  post: PostFragment;
}

const CopyPostText = ({ post }: CopyPostTextProps) => {
  const filteredContent = getPostData(post.metadata)?.content || "";

  const copyContent = useCopyToClipboard(
    filteredContent || "",
    "Content copied to clipboard!"
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
        copyContent();
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="size-4" />
        <div>{post.commentOn ? "Copy comment text" : "Copy post text"}</div>
      </div>
    </MenuItem>
  );
};

export default CopyPostText;
