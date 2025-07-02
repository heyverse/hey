import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import { CACHE_AGE_1_DAY } from "../../utils/constants";
import handleApiError from "../../utils/handleApiError";
import { generateExtraLongExpiry, getRedis, setRedis } from "../../utils/redis";
import sha256 from "../../utils/sha256";
import getMetadata from "./helpers/getMetadata";

const getOembed = async (ctx: Context) => {
  try {
    const { url } = ctx.req.query();
    const cacheKey = `oembed:${sha256(url)}`;
    const cachedValue = await getRedis(cacheKey);

    ctx.header("Cache-Control", CACHE_AGE_1_DAY);

    if (cachedValue) {
      return ctx.json({
        cached: true,
        data: JSON.parse(cachedValue),
        status: Status.Success
      });
    }

    const oembed = await getMetadata(url);
    await setRedis(cacheKey, oembed, generateExtraLongExpiry());

    return ctx.json({ data: oembed, status: Status.Success });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default getOembed;
