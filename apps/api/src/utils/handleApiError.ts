import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";

const handleApiError = (ctx: Context): Response =>
  ctx.json({ status: "error", error: ERRORS.SomethingWentWrong }, 500);

export default handleApiError;
