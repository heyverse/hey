import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import { SITEMAP_BATCH_SIZE } from "src/utils/constants";
import lensPg from "src/utils/lensPg";
import { getRedis, hoursToSeconds, setRedis } from "src/utils/redis";
import { create } from "xmlbuilder2";

const accountSitemap = async (ctx: Context) => {
  const params = ctx.req.param();
  const group = params["group"];
  const batch = params["batch.xml"].replace(".xml", "");

  if (Number.isNaN(Number(group)) || Number.isNaN(Number(batch))) {
    return ctx.body(ERRORS.SomethingWentWrong);
  }

  if (Number(group) === 0 || Number(batch) === 0) {
    return ctx.body(ERRORS.SomethingWentWrong);
  }

  try {
    const cacheKey = `sitemap:accounts:${group}-${batch}`;
    const cachedData = await getRedis(cacheKey);

    const sitemap = create({ version: "1.0", encoding: "UTF-8" }).ele(
      "urlset",
      { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }
    );

    if (cachedData) {
      const usernames: string[] = JSON.parse(cachedData);
      for (const username of usernames) {
        sitemap
          .ele("url")
          .ele("loc")
          .txt(`https://hey.xyz/u/${username}`)
          .up()
          .ele("lastmod")
          .txt(new Date().toISOString())
          .up();
      }
    } else {
      const globalBatch =
        (Number(group) - 1) * SITEMAP_BATCH_SIZE + (Number(batch) - 1);
      const dbUsernames = (await lensPg.query(
        `
          SELECT local_name
          FROM account.username_assigned
          WHERE id > $1
          ORDER BY id
          LIMIT $2;
        `,
        [globalBatch * SITEMAP_BATCH_SIZE, SITEMAP_BATCH_SIZE]
      )) as Array<{ local_name: string }>;

      const usernamesToCache: string[] = [];
      for (const { local_name } of dbUsernames) {
        usernamesToCache.push(local_name);
        sitemap
          .ele("url")
          .ele("loc")
          .txt(`https://hey.xyz/u/${local_name}`)
          .up()
          .ele("lastmod")
          .txt(new Date().toISOString())
          .up();
      }
      await setRedis(cacheKey, usernamesToCache, hoursToSeconds(50 * 24));
    }

    ctx.header("Content-Type", "application/xml");
    return ctx.body(sitemap.end({ prettyPrint: true }));
  } catch {
    return ctx.body(ERRORS.SomethingWentWrong);
  }
};

export default accountSitemap;
