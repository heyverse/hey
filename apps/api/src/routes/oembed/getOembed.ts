import type { Context } from "hono";
import { CACHE_AGE_1_DAY } from "src/utils/constants";
import handleApiError from "src/utils/handleApiError";
import { generateExtraLongExpiry, getRedis, setRedis } from "src/utils/redis";
import sha256 from "src/utils/sha256";
import getMetadata from "./helpers/getMetadata";

const getOembed = async (ctx: Context) => {
  try {
    const { url } = ctx.req.query();
    const cacheKey = `oembed:${sha256(url)}`;
    const cachedValue = await getRedis(cacheKey);

    ctx.header("Cache-Control", CACHE_AGE_1_DAY);

    if (cachedValue) {
      return ctx.json({
        success: true,
        cached: true,
        data: JSON.parse(cachedValue)
      });
    }

    const oembed = await getMetadata(url);
    await setRedis(cacheKey, oembed, generateExtraLongExpiry());

    return ctx.json({ success: true, data: oembed });
  } catch {
    return handleApiError(ctx);
  }
};

export default getOembed;
