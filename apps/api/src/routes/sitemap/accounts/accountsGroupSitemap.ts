import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import { create } from "xmlbuilder2";
import {
  SITEMAP_BATCH_SIZE,
  SITEMAP_CACHE_DAYS
} from "../../../utils/constants";
import lensPg from "../../../utils/lensPg";
import { getRedis, hoursToSeconds, setRedis } from "../../../utils/redis";
import generateSitemap from "../common";

const accountsGroupSitemap = async (ctx: Context) => {
  const params = ctx.req.param();
  const groupParam = params["group.xml"].replace(".xml", "");

  if (Number.isNaN(Number(groupParam)) || Number(groupParam) === 0) {
    return ctx.body(ERRORS.SomethingWentWrong);
  }

  const group = Number(groupParam);

  return generateSitemap({
    ctx,
    cacheKey: `sitemap:accounts:group:${group}`,
    buildXml: async () => {
      const cacheKey = "sitemap:accounts:total";
      const cachedData = await getRedis(cacheKey);
      let totalBatches: number;

      if (cachedData) {
        totalBatches = Number(cachedData);
      } else {
        const usernames = (await lensPg.query(
          `
          SELECT CEIL(COUNT(*) / $1) AS count
          FROM account.username_assigned;
        `,
          [SITEMAP_BATCH_SIZE]
        )) as Array<{ count: number }>;

        totalBatches = Number(usernames[0]?.count) || 0;
        await setRedis(
          cacheKey,
          totalBatches,
          hoursToSeconds(SITEMAP_CACHE_DAYS * 24)
        );
      }

      const startBatch = (group - 1) * SITEMAP_BATCH_SIZE;
      const endBatch = Math.min(startBatch + SITEMAP_BATCH_SIZE, totalBatches);

      const sitemapIndex = create({ version: "1.0", encoding: "UTF-8" }).ele(
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
    }
  });
};

export default accountsGroupSitemap;
