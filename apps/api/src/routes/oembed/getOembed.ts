import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import { CACHE_AGE_1_DAY } from "@/utils/constants";
import handleApiError from "@/utils/handleApiError";
import getMetadata from "./helpers/getMetadata";

const getOembed = async (ctx: Context) => {
  try {
    const { url } = ctx.req.query();
    ctx.header("Cache-Control", CACHE_AGE_1_DAY);
    const oembed = await getMetadata(url);
    return ctx.json({ data: oembed, status: Status.Success });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default getOembed;
