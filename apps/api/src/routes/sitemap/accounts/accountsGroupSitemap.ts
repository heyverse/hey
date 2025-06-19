import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import { SITEMAP_BATCH_SIZE } from "src/utils/constants";
import lensPg from "src/utils/lensPg";
import { getRedis, hoursToSeconds, setRedis } from "src/utils/redis";
import buildSitemap from "../common";

const accountsGroupSitemap = async (ctx: Context) => {
  const params = ctx.req.param();
  const groupParam = params["group.xml"].replace(".xml", "");

  if (Number.isNaN(Number(groupParam)) || Number(groupParam) === 0) {
    return ctx.body(ERRORS.SomethingWentWrong);
  }

  const group = Number(groupParam);

  const xmlCacheKey = `sitemap:accounts:${group}`;

  return buildSitemap({
    ctx,
    cacheKey: xmlCacheKey,
    rootName: "sitemapindex",
    getItems: async () => {
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
        await setRedis(cacheKey, totalBatches, hoursToSeconds(50 * 24));
      }

      const startBatch = (group - 1) * SITEMAP_BATCH_SIZE;
      const endBatch = Math.min(startBatch + SITEMAP_BATCH_SIZE, totalBatches);

      return Array.from({ length: endBatch - startBatch }, (_, i) => i + 1);
    },
    buildItem: (sitemap, batch: number) => {
      sitemap
        .ele("sitemap")
        .ele("loc")
        .txt(`https://hey.xyz/sitemap/accounts/${group}/${batch}.xml`)
        .up()
        .ele("lastmod")
        .txt(new Date().toISOString())
        .up();
    },
    expiry: hoursToSeconds(50 * 24)
  });
};

export default accountsGroupSitemap;
