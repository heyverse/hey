import { Status } from "@hey/data/enums";
import { ERRORS } from "@hey/data/errors";
import logger from "@hey/helpers/logger";
import type { Context } from "hono";

const handleApiError = (ctx: Context, error?: unknown): Response => {
  logger.error(error);

  return ctx.json(
    { error: ERRORS.SomethingWentWrong, status: Status.Error },
    500
  );
};

export default handleApiError;
