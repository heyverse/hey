import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";

const handleApiError = (ctx: Context): Response =>
  ctx.json({ success: false, error: ERRORS.SomethingWentWrong }, 500);

export default handleApiError;
