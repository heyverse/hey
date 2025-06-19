import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import { SITEMAP_CACHE_DAYS } from "src/utils/constants";
import { getRedis, hoursToSeconds, setRedis } from "src/utils/redis";

export interface SitemapHelperOptions {
  ctx: Context;
  cacheKey: string;
  buildXml: () => Promise<string>;
}

const generateSitemap = async ({
  ctx,
  cacheKey,
  buildXml
}: SitemapHelperOptions) => {
  try {
    const cached = await getRedis(cacheKey);
    if (cached) {
      ctx.header("Content-Type", "application/xml");
      return ctx.body(cached);
    }

    const xml = await buildXml();

    await setRedis(cacheKey, xml, hoursToSeconds(SITEMAP_CACHE_DAYS * 24));

    ctx.header("Content-Type", "application/xml");
    return ctx.body(xml);
  } catch {
    return ctx.body(ERRORS.SomethingWentWrong);
  }
};

export default generateSitemap;
