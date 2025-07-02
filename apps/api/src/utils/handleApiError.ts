import { Status } from "@hey/data/enums";
import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";

const handleApiError = (ctx: Context, error?: unknown): Response => {
  console.error(error);

  return ctx.json(
    { error: ERRORS.SomethingWentWrong, status: Status.Error },
    500
  );
};

export default handleApiError;
