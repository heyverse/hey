import type { NewAttachment } from "@hey/types/misc";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  compressFiles,
  createPreviewAttachments,
  validateFileSize
} from "@/helpers/attachmentUtils";
import uploadToIPFS from "@/helpers/uploadToIPFS";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";

const useUploadAttachments = () => {
  const {
    addAttachments,
    removeAttachments,
    setIsUploading,
    updateAttachments
  } = usePostAttachmentStore();

  const handleUploadAttachments = useCallback(
    async (attachments: FileList): Promise<NewAttachment[]> => {
      setIsUploading(true);

      const files = Array.from(attachments);
      const compressedFiles = await compressFiles(files);

      if (!compressedFiles.every(validateFileSize)) {
        setIsUploading(false);
        return [];
      }

      const previewAttachments = createPreviewAttachments(compressedFiles);
      const attachmentIds = previewAttachments.map(({ id }) => id as string);

      addAttachments(previewAttachments);

      try {
        const uploaded = await uploadToIPFS(compressedFiles);
        const result = uploaded.map((file, index) => ({
          ...previewAttachments[index],
          mimeType: file.mimeType,
          uri: file.uri
        }));

        updateAttachments(result);
        setIsUploading(false);

        return result;
      } catch {
        toast.error("Something went wrong while uploading!");
        removeAttachments(attachmentIds);
        setIsUploading(false);
        return [];
      }
    },
    [addAttachments, removeAttachments, setIsUploading, updateAttachments]
  );

  return { handleUploadAttachments };
};

export default useUploadAttachments;
