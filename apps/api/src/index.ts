import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import tokenContext from "./context/tokenContext";
import accountRouter from "./routes/account";
import internalRouter from "./routes/internal";
import lensRouter from "./routes/lens";
import liveRouter from "./routes/live";
import metadataRouter from "./routes/metadata";
import oembedRouter from "./routes/oembed";
import ping from "./routes/ping";
import preferencesRouter from "./routes/preferences";
import sitemap from "./routes/sitemap";

const app = new Hono();

// Context
app.use(tokenContext);

// Routes
app.get("/ping", ping);
app.route("/lens", lensRouter);
app.route("/account", accountRouter);
app.route("/internal", internalRouter);
app.route("/live", liveRouter);
app.route("/metadata", metadataRouter);
app.route("/oembed", oembedRouter);
app.route("/preferences", preferencesRouter);
app.get("/sitemap.xml", sitemap);

serve(app, (info) => {
  console.info(`Server running on port ${info.port}`);
});
