import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import { create } from "xmlbuilder2";

const sitemaps = [
  { path: "/sitemap/pages.xml" },
  { path: "/sitemap/accounts.xml" }
];

const sitemapIndex = async (ctx: Context) => {
  try {
    const sitemapIndex = create({ encoding: "UTF-8", version: "1.0" }).ele(
      "sitemapindex",
      { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }
    );

    for (const sitemap of sitemaps) {
      sitemapIndex
        .ele("sitemap")
        .ele("loc")
        .txt(`https://hey.xyz${sitemap.path}`)
        .up()
        .ele("lastmod")
        .txt(new Date().toISOString())
        .up();
    }

    ctx.header("Content-Type", "application/xml");
    return ctx.body(sitemapIndex.end({ prettyPrint: true }));
  } catch {
    return ctx.body(ERRORS.SomethingWentWrong);
  }
};

export default sitemapIndex;
