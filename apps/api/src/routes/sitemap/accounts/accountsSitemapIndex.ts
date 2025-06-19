import type { Context } from "hono";
import { SITEMAP_BATCH_SIZE } from "src/utils/constants";
import lensPg from "src/utils/lensPg";
import { getRedis, hoursToSeconds, setRedis } from "src/utils/redis";
import buildSitemap from "../common";

const accountsSitemapIndex = async (ctx: Context) => {
  return buildSitemap({
    ctx,
    cacheKey: "sitemap:accounts:index",
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

      const totalGroups = Math.ceil(totalBatches / SITEMAP_BATCH_SIZE);
      return Array.from({ length: totalGroups }, (_, i) => i + 1);
    },
    buildItem: (sitemap, group: number) => {
      sitemap
        .ele("sitemap")
        .ele("loc")
        .txt(`https://hey.xyz/sitemap/accounts/${group}.xml`)
        .up()
        .ele("lastmod")
        .txt(new Date().toISOString())
        .up();
    },
    expiry: hoursToSeconds(50 * 24)
  });
};

export default accountsSitemapIndex;
