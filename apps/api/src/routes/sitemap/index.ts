import { Hono } from "hono";
import accountSitemap from "./accounts/accountSitemap";
import accountsGroupSitemap from "./accounts/accountsGroupSitemap";
import accountsSitemapIndex from "./accounts/accountsSitemapIndex";
import pagesSitemap from "./pagesSitemap";
import sitemapIndex from "./sitemapIndex";

const app = new Hono();

app.get("/all.xml", sitemapIndex);
app.get("/pages.xml", pagesSitemap);
app.get("/accounts.xml", accountsSitemapIndex);
app.get("/accounts/:group.xml", accountsGroupSitemap);
app.get("/accounts/:group/:batch.xml", accountSitemap);

export default app;
