import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import { SITEMAP_BATCH_SIZE } from "src/utils/constants";
import lensPg from "src/utils/lensPg";
import { hoursToSeconds } from "src/utils/redis";
import buildSitemap from "../common";

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

  const cacheKey = `sitemap:accounts:${group}-${batch}`;

  return buildSitemap({
    ctx,
    cacheKey,
    rootName: "urlset",
    getItems: async () => {
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

      return dbUsernames.map(({ local_name }) => local_name);
    },
    buildItem: (sitemap, username: string) => {
      sitemap
        .ele("url")
        .ele("loc")
        .txt(`https://hey.xyz/u/${username}`)
        .up()
        .ele("lastmod")
        .txt(new Date().toISOString())
        .up();
    },
    expiry: hoursToSeconds(50 * 24)
  });
};

export default accountSitemap;
