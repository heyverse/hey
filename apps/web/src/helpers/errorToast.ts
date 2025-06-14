import { ERRORS } from "@hey/data/errors";
import { toast } from "sonner";

const FORBIDDEN_ERROR_PREFIX =
  "Forbidden - Failed to generate source stamp: App rejected verification request:";
const CONNECTOR_ERROR = "Connector not connected";

interface ErrorPayload {
  message?: string;
  data?: {
    message?: string;
  };
}

const getMessage = (err?: unknown): string | undefined => {
  if (!err) return undefined;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;

  const error = err as ErrorPayload;
  return error.data?.message ?? error.message;
};

const errorToast = (error?: unknown): void => {
  const message = getMessage(error);

  if (!message || message.includes("viem")) return;

  if (message.includes(FORBIDDEN_ERROR_PREFIX)) {
    toast.error(message.replace(FORBIDDEN_ERROR_PREFIX, ""), { id: "error" });
    return;
  }

  if (message.includes(CONNECTOR_ERROR)) {
    toast.error("Connect or switch to the correct wallet!", {
      id: "connector-error"
    });
    return;
  }

  toast.error(message || ERRORS.SomethingWentWrong, { id: "error" });
};

export default errorToast;
