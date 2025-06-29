import type { Context } from "hono";
import { create } from "xmlbuilder2";
import { SITEMAP_BATCH_SIZE } from "../../../utils/constants";
import generateSitemap from "../common";
import getTotalAccountBatches from "./getTotalAccountBatches";

const accountsSitemapIndex = async (ctx: Context) =>
  generateSitemap({
    buildXml: async () => {
      const totalBatches = await getTotalAccountBatches();

      const totalGroups = Math.ceil(totalBatches / SITEMAP_BATCH_SIZE);

      const sitemapIndex = create({ encoding: "UTF-8", version: "1.0" }).ele(
        "sitemapindex",
        { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }
      );

      for (let i = 0; i < totalGroups; i++) {
        sitemapIndex
          .ele("sitemap")
          .ele("loc")
          .txt(`https://hey.xyz/sitemap/accounts/${i + 1}.xml`)
          .up()
          .ele("lastmod")
          .txt(new Date().toISOString())
          .up();
      }

      return sitemapIndex.end({ prettyPrint: true });
    },
    cacheKey: "sitemap:accounts:index",
    ctx
  });

export default accountsSitemapIndex;
