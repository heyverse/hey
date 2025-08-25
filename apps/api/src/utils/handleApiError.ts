import { Status } from "@hey/data/enums";
import { ERRORS } from "@hey/data/errors";
import logger from "@hey/helpers/logger";
import type { Context } from "hono";
import ApiError from "@/utils/apiError";

const handleApiError = (ctx: Context, error?: unknown): Response => {
  logger.error(error);

  if (error instanceof ApiError) {
    return ctx.json(
      { error: error.message, status: Status.Error },
      error.statusCode
    );
  }

  return ctx.json(
    { error: ERRORS.SomethingWentWrong, status: Status.Error },
    500
  );
};

export default handleApiError;
