import { useCallback } from "react";
import { toast } from "sonner";

const useCopyToClipboard = (
  text: string,
  successMessage = "Copied to clipboard!",
  errorMessage = "Failed to copy"
) => {
  return useCallback(async () => {
    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error("Clipboard API not available");
      }

      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
    } catch {
      toast.error(errorMessage);
    }
  }, [text, successMessage, errorMessage]);
};

export default useCopyToClipboard;
