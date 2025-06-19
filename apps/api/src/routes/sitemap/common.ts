import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import { getRedis, setRedis } from "src/utils/redis";
import { create } from "xmlbuilder2";

export interface SitemapHelperOptions<T> {
  ctx: Context;
  cacheKey: string;
  rootName: "urlset" | "sitemapindex";
  getItems: () => Promise<T[]>;
  buildItem: (root: any, item: T) => void;
  expiry?: number;
}

const buildSitemap = async <T>({
  ctx,
  cacheKey,
  rootName,
  getItems,
  buildItem,
  expiry
}: SitemapHelperOptions<T>) => {
  try {
    const cached = await getRedis(cacheKey);
    if (cached) {
      ctx.header("Content-Type", "application/xml");
      return ctx.body(String(cached));
    }

    const items = await getItems();
    const xml = create({ version: "1.0", encoding: "UTF-8" }).ele(rootName, {
      xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
    });

    for (const item of items) {
      buildItem(xml, item);
    }

    const xmlString = xml.end({ prettyPrint: true });
    await setRedis(cacheKey, xmlString, expiry);

    ctx.header("Content-Type", "application/xml");
    return ctx.body(xmlString);
  } catch {
    return ctx.body(ERRORS.SomethingWentWrong);
  }
};

export default buildSitemap;
