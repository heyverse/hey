import { Status } from "@hey/data/enums";
import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";

const handleApiError = (ctx: Context): Response =>
  ctx.json({ status: Status.Error, error: ERRORS.SomethingWentWrong }, 500);

export default handleApiError;
