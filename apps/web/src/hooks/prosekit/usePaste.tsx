import type { EditorExtension } from "@helpers/prosekit/extension";
import { type Editor, defineDOMEventHandler, union } from "prosekit/core";
import { useExtension } from "prosekit/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import useUploadAttachments from "src/hooks/useUploadAttachments";
import { usePostAttachmentStore } from "src/store/non-persisted/post/usePostAttachmentStore";

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
      if (attachments.length === 4 || totalAttachments > 4) {
        return toast.error("Please choose either 1 video or up to 4 photos.");
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
