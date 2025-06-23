import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import { create } from "xmlbuilder2";

const urls = [
  { path: "/", priority: "1" },
  { path: "/terms", priority: "1" },
  { path: "/privacy", priority: "1" },
  { path: "/guidelines", priority: "1" },
  { path: "/support", priority: "1" }
];

const pagesSitemap = async (ctx: Context) => {
  try {
    const sitemap = create({ encoding: "UTF-8", version: "1.0" }).ele(
      "urlset",
      { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }
    );

    for (const page of urls) {
      sitemap
        .ele("url")
        .ele("loc")
        .txt(`https://hey.xyz${page.path}`)
        .up()
        .ele("lastmod")
        .txt(new Date().toISOString())
        .up();
    }

    ctx.header("Content-Type", "application/xml");
    return ctx.body(sitemap.end({ prettyPrint: true }));
  } catch {
    return ctx.body(ERRORS.SomethingWentWrong);
  }
};

export default pagesSitemap;
