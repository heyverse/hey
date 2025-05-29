import { Errors } from "@hey/data/errors";
import type { Context } from "hono";

const getJumperData = async (ctx: Context) => {
  // const { address, id } = await ctx.req.json();

  try {
    return ctx.json({ success: true });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default getJumperData;
