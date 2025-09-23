import { Status } from "@hey/data/enums";
import { ERRORS } from "@hey/data/errors";
import logger from "@hey/helpers/logger";
import type { Context } from "hono";
import ApiError from "@/utils/apiError";

const handleApiError = (ctx: Context, error?: unknown): Response => {
  logger.error(error);

  if (error instanceof ApiError) {
    ctx.status(error.statusCode);
    return ctx.json({ error: error.message, status: Status.Error });
  }

  ctx.status(500);
  return ctx.json({ error: ERRORS.SomethingWentWrong, status: Status.Error });
};

export default handleApiError;
