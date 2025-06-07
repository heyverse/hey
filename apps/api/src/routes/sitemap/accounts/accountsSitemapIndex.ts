import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import { SITEMAP_BATCH_SIZE } from "src/utils/constants";
import lensPg from "src/utils/lensPg";
import { getRedis, hoursToSeconds, setRedis } from "src/utils/redis";
import { create } from "xmlbuilder2";

const accountsSitemapIndex = async (ctx: Context) => {
  try {
    const cacheKey = "sitemap:accounts:total";
    const cachedData = await getRedis(cacheKey);
    let totalUsernames: number;

    if (cachedData) {
      totalUsernames = Number(cachedData);
    } else {
      const usernames = await lensPg.query(
        `
          SELECT CEIL(COUNT(*) / $1) AS count
          FROM account.username_assigned;
        `,
        [SITEMAP_BATCH_SIZE]
      );

      totalUsernames = Number(usernames[0]?.count) || 0;
      await setRedis(cacheKey, totalUsernames, hoursToSeconds(50 * 24));
    }

    const sitemapIndex = create({ version: "1.0", encoding: "UTF-8" }).ele(
      "sitemapindex",
      { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }
    );

    for (let i = 0; i < totalUsernames; i++) {
      sitemapIndex
        .ele("sitemap")
        .ele("loc")
        .txt(`https://hey.xyz/sitemap/accounts/${i + 1}.xml`)
        .up()
        .ele("lastmod")
        .txt(new Date().toISOString())
        .up();
    }

    ctx.header("Content-Type", "application/xml");
    return ctx.body(sitemapIndex.end({ prettyPrint: true }));
  } catch {
    return ctx.body(Errors.SomethingWentWrong);
  }
};

export default accountsSitemapIndex;
