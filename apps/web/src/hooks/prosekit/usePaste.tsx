import type { EditorExtension } from "@/helpers/prosekit/extension";
import useUploadAttachments from "@/hooks/useUploadAttachments";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import { MAX_IMAGE_UPLOAD } from "@hey/data/constants";
import { type Editor, defineDOMEventHandler, union } from "prosekit/core";
import { useExtension } from "prosekit/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";

const handleFiles = (
  event: Event,
  files: FileList | null | undefined,
  onPaste: (files: FileList) => void
): boolean => {
  if (files?.length) {
    event.preventDefault();
    onPaste(files);
    return true;
  }
  return false;
};

const definePasteDropExtension = (onPaste: (files: FileList) => void) => {
  const dropExtension = defineDOMEventHandler("drop", (_view, event): boolean =>
    handleFiles(event, event?.dataTransfer?.files, onPaste)
  );

  const pasteExtension = defineDOMEventHandler(
    "paste",
    (_view, event): boolean => {
      if (event?.clipboardData?.getData("Text")) {
        return false; // Ignore text pastes
      }
      return handleFiles(event, event?.clipboardData?.files, onPaste);
    }
  );

  return union([dropExtension, pasteExtension]);
};

export const usePaste = (editor: Editor<EditorExtension>) => {
  const { attachments } = usePostAttachmentStore((state) => state);
  const { handleUploadAttachments } = useUploadAttachments();

  const handlePaste = useCallback(
    async (pastedFiles: FileList) => {
      const totalAttachments = attachments.length + pastedFiles.length;
      if (
        attachments.length === MAX_IMAGE_UPLOAD ||
        totalAttachments > MAX_IMAGE_UPLOAD
      ) {
        return toast.error(
          `Please choose either 1 video or up to ${MAX_IMAGE_UPLOAD} photos.`
        );
      }

      if (pastedFiles) {
        await handleUploadAttachments(pastedFiles);
      }
    },
    [handleUploadAttachments, attachments.length]
  );

  const handlePasteRef = useRef(handlePaste);

  useEffect(() => {
    handlePasteRef.current = handlePaste;
  }, [handlePaste]);

  const extension = useMemo(() => {
    return definePasteDropExtension((files) => handlePasteRef.current(files));
  }, []);

  useExtension(extension, { editor });
};
