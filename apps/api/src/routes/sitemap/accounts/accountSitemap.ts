import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import { create } from "xmlbuilder2";
import { SITEMAP_BATCH_SIZE } from "@/utils/constants";
import lensPg from "@/utils/lensPg";
import generateSitemap from "../common";

const accountSitemap = async (ctx: Context) => {
  const params = ctx.req.param();
  const group = params["group"];
  const batch = params["batch.xml"].replace(".xml", "");

  if (Number.isNaN(Number(group)) || Number.isNaN(Number(batch))) {
    return ctx.body(ERRORS.SomethingWentWrong, 400);
  }

  if (Number(group) === 0 || Number(batch) === 0) {
    return ctx.body(ERRORS.SomethingWentWrong, 400);
  }

  return generateSitemap({
    buildXml: async () => {
      const sitemap = create({ encoding: "UTF-8", version: "1.0" }).ele(
        "urlset",
        { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }
      );

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

      for (const { local_name } of dbUsernames) {
        sitemap
          .ele("url")
          .ele("loc")
          .txt(`https://hey.xyz/u/${local_name}`)
          .up()
          .ele("lastmod")
          .txt(new Date().toISOString())
          .up();
      }

      return sitemap.end({ prettyPrint: true });
    },
    cacheKey: `sitemap:accounts:${group}-${batch}`,
    ctx
  });
};

export default accountSitemap;
