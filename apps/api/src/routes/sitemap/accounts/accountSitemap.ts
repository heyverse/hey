import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import { SITEMAP_BATCH_SIZE } from "src/utils/constants";
import lensPg from "src/utils/lensPg";
import { generateForeverExpiry, getRedis, setRedis } from "src/utils/redis";
import { create } from "xmlbuilder2";

const accountSitemap = async (ctx: Context) => {
  const params = ctx.req.param();
  const batch = params["batch.xml"].replace(".xml", "");

  if (Number.isNaN(Number(batch))) {
    return ctx.body(Errors.SomethingWentWrong);
  }

  if (Number(batch) === 0) {
    return ctx.body(Errors.SomethingWentWrong);
  }

  try {
    const cacheKey = `sitemap:accounts:${batch}`;
    const cachedData = await getRedis(cacheKey);
    let usernames: string[];

    if (cachedData) {
      usernames = JSON.parse(cachedData);
    } else {
      const newUsernames = await lensPg.query(
        `
        SELECT local_name
        FROM account.username_assigned
        ORDER BY timestamp
        LIMIT $1
        OFFSET $2;
      `,
        [SITEMAP_BATCH_SIZE, (Number(batch) - 1) * SITEMAP_BATCH_SIZE]
      );

      usernames = newUsernames.map((username) => username.local_name);
      await setRedis(
        cacheKey,
        JSON.stringify(usernames),
        generateForeverExpiry()
      );
    }

    const sitemap = create({ version: "1.0", encoding: "UTF-8" }).ele(
      "urlset",
      {
        xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        "xmlns:news": "http://www.google.com/schemas/sitemap-news/0.9",
        "xmlns:xhtml": "http://www.w3.org/1999/xhtml",
        "xmlns:mobile": "http://www.google.com/schemas/sitemap-mobile/1.0",
        "xmlns:image": "http://www.google.com/schemas/sitemap-image/1.1",
        "xmlns:video": "http://www.google.com/schemas/sitemap-video/1.1"
      }
    );

    for (const username of usernames) {
      sitemap
        .ele("url")
        .ele("loc")
        .txt(`https://hey.xyz/u/${username}`)
        .up()
        .ele("lastmod")
        .txt(new Date().toISOString())
        .up()
        .ele("changefreq")
        .txt("weekly")
        .up()
        .ele("priority")
        .txt("1")
        .up();
    }

    ctx.header("Content-Type", "application/xml");
    return ctx.body(sitemap.end({ prettyPrint: true }));
  } catch {
    return ctx.body(Errors.SomethingWentWrong);
  }
};

export default accountSitemap;
