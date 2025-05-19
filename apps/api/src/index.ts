import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import authContext from "./context/authContext";
import cors from "./middlewares/cors";
import infoLogger from "./middlewares/infoLogger";
import guildRouter from "./routes/guild";
import lensRouter from "./routes/lens";
import liveRouter from "./routes/live";
import metadataRouter from "./routes/metadata";
import oembedRouter from "./routes/oembed";
import ogRouter from "./routes/og";
import ping from "./routes/ping";
import preferencesRouter from "./routes/preferences";
import sitemapRouter from "./routes/sitemap";
import tempRouter from "./routes/temp";

const app = new Hono();

// Context
app.use(cors);
app.use(authContext);
app.use(infoLogger);

// Routes
app.get("/ping", ping);
app.route("/lens", lensRouter);
app.route("/guild", guildRouter);
app.route("/live", liveRouter);
app.route("/metadata", metadataRouter);
app.route("/oembed", oembedRouter);
app.route("/preferences", preferencesRouter);
app.route("/sitemap", sitemapRouter);
app.route("/og", ogRouter);
app.route("/temp", tempRouter);

serve({ fetch: app.fetch, port: 4784 }, (info) => {
  console.info(`Server running on port ${info.port}`);
});
