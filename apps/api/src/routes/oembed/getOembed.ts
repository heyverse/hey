import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import { CACHE_AGE_1_DAY } from "../../helpers/constants";
import getMetadata from "./helpers/getMetadata";

const getOembed = async (ctx: Context) => {
  try {
    const { url } = await ctx.req.json();
    ctx.header("Cache-Control", CACHE_AGE_1_DAY);
    return ctx.json(await getMetadata(url));
  } catch {
    return ctx.json({ error: Errors.SomethingWentWrong }, 500);
  }
};

export default getOembed;
