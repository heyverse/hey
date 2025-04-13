import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import { CACHE_AGE_1_DAY } from "../../helpers/constants";
import getMetadata from "./helpers/getMetadata";

const getOembed = async (ctx: Context) => {
  try {
    const { url } = ctx.req.query();
    ctx.header("Cache-Control", CACHE_AGE_1_DAY);
    return ctx.json({
      success: true,
      data: await getMetadata(url)
    });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default getOembed;
