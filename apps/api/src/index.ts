import { serve } from "@hono/node-server";
import "dotenv/config";
import type { Http2ServerOptions } from "node:http2";
import { createServer } from "node:http2";
import { Status } from "@hey/data/enums";
import logger from "@hey/helpers/logger";
import { Hono } from "hono";
import { compress } from "hono/compress";
import authContext from "./context/authContext";
import cors from "./middlewares/cors";
import infoLogger from "./middlewares/infoLogger";
import appRouter from "./routes/app";
import cronRouter from "./routes/cron";
import lensRouter from "./routes/lens";
import metadataRouter from "./routes/metadata";
import oembedRouter from "./routes/oembed";
import ogRouter from "./routes/og";
import ping from "./routes/ping";
import preferencesRouter from "./routes/preferences";
import sitemapRouter from "./routes/sitemap";

const app = new Hono();

// Context
app.use(compress());
app.use(cors);
app.use(authContext);
app.use(infoLogger);

// Routes
app.get("/ping", ping);
app.route("/app", appRouter);
app.route("/lens", lensRouter);
app.route("/cron", cronRouter);
app.route("/metadata", metadataRouter);
app.route("/oembed", oembedRouter);
app.route("/preferences", preferencesRouter);
app.route("/sitemap", sitemapRouter);
app.route("/og", ogRouter);

app.notFound((ctx) =>
  ctx.json({ error: "Not Found", status: Status.Error }, 404)
);

interface ExtendedHttp2ServerOptions extends Http2ServerOptions {
  keepAliveTimeout: number;
  headersTimeout: number;
  requestTimeout: number;
}

const serverOptions: ExtendedHttp2ServerOptions = {
  allowHTTP1: true,
  headersTimeout: 65_000,
  keepAliveTimeout: 60_000,
  requestTimeout: 60_000
};

serve({ createServer, fetch: app.fetch, port: 4784, serverOptions }, (info) => {
  logger.info(`Server running on port ${info.port}`);
});
