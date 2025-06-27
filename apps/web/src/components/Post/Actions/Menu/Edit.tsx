import { MenuItem } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import generateUUID from "@hey/helpers/generateUUID";
import getPostData from "@hey/helpers/getPostData";
import type { PostFragment } from "@hey/indexer";

import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useNewPostModalStore } from "@/store/non-persisted/modal/useNewPostModalStore";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import { usePostStore } from "@/store/non-persisted/post/usePostStore";

interface EditProps {
  post: PostFragment;
}

const Edit = ({ post }: EditProps) => {
  const { setShowNewPostModal } = useNewPostModalStore();
  const { setPostContent, setEditingPost } = usePostStore();
  const { setAttachments } = usePostAttachmentStore();

  const handleEdit = () => {
    const data = getPostData(post.metadata);
    setPostContent(data?.content || "");
    setEditingPost(post);

    const attachments = [] as any[];
    if (data?.asset) {
      attachments.push({
        id: generateUUID(),
        mimeType:
          data.asset.type === "Image"
            ? "image/jpeg"
            : data.asset.type === "Video"
              ? "video/mp4"
              : "audio/mpeg",
        previewUri: data.asset.uri,
        type: data.asset.type,
        uri: data.asset.uri
      });
    }

    if (data?.attachments) {
      for (const a of data.attachments) {
        attachments.push({
          id: generateUUID(),
          mimeType:
            a.type === "Image"
              ? "image/jpeg"
              : a.type === "Video"
                ? "video/mp4"
                : "audio/mpeg",
          previewUri: a.uri,
          type: a.type,
          uri: a.uri
        });
      }
    }
    setAttachments(attachments);
    setShowNewPostModal(true);
  };

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
        handleEdit();
      }}
    >
      <div className="flex items-center space-x-2">
        <PencilSquareIcon className="size-4" />
        <div>Edit</div>
      </div>
    </MenuItem>
  );
};

export default Edit;
