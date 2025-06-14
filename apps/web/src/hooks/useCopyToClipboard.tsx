import { useCallback } from "react";
import { toast } from "sonner";

const useCopyToClipboard = (
  text: string,
  successMessage = "Copied to clipboard!"
) => {
  return useCallback(async () => {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  }, [text, successMessage]);
};

export default useCopyToClipboard;
