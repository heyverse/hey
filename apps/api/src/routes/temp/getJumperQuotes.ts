import { Errors } from "@hey/data/errors";
import type { Context } from "hono";

const getJumperQuotes = async (ctx: Context) => {
  try {
    return ctx.json({ success: true });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default getJumperQuotes;
