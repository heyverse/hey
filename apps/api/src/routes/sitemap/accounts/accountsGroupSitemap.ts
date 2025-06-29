import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import { create } from "xmlbuilder2";
import { SITEMAP_BATCH_SIZE } from "../../../utils/constants";
import generateSitemap from "../common";
import getTotalAccountBatches from "./getTotalAccountBatches";

const accountsGroupSitemap = async (ctx: Context) => {
  const params = ctx.req.param();
  const groupParam = params["group.xml"].replace(".xml", "");

  if (Number.isNaN(Number(groupParam)) || Number(groupParam) === 0) {
    return ctx.body(ERRORS.SomethingWentWrong);
  }

  const group = Number(groupParam);

  return generateSitemap({
    buildXml: async () => {
      const totalBatches = await getTotalAccountBatches();

      const startBatch = (group - 1) * SITEMAP_BATCH_SIZE;
      const endBatch = Math.min(startBatch + SITEMAP_BATCH_SIZE, totalBatches);

      const sitemapIndex = create({ encoding: "UTF-8", version: "1.0" }).ele(
        "sitemapindex",
        { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }
      );

      for (let i = startBatch; i < endBatch; i++) {
        sitemapIndex
          .ele("sitemap")
          .ele("loc")
          .txt(
            `https://hey.xyz/sitemap/accounts/${group}/${i - startBatch + 1}.xml`
          )
          .up()
          .ele("lastmod")
          .txt(new Date().toISOString())
          .up();
      }

      return sitemapIndex.end({ prettyPrint: true });
    },
    cacheKey: `sitemap:accounts:group:${group}`,
    ctx
  });
};

export default accountsGroupSitemap;
