import { Errors } from "@hey/data/errors";
import type { Context } from "hono";

const getJumperTips = async (ctx: Context) => {
  try {
    return ctx.json({ success: true });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default getJumperTips;
