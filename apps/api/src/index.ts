import { serve } from "@hono/node-server";
import "dotenv/config";
import { Status } from "@hey/data/enums";
import logger from "@hey/helpers/logger";
import { Hono } from "hono";
import authContext from "./context/authContext";
import authMiddleware from "./middlewares/authMiddleware";
import cors from "./middlewares/cors";
import infoLogger from "./middlewares/infoLogger";
import rateLimiter from "./middlewares/rateLimiter";
import pageview from "./pageview";
import posts from "./posts";
import cronRouter from "./routes/cron";
import lensRouter from "./routes/lens";
import metadataRouter from "./routes/metadata";
import oembedRouter from "./routes/oembed";
import ogRouter from "./routes/og";
import ping from "./routes/ping";
import startDiscordWebhookWorker from "./workers/discordWebhook";

const app = new Hono();

// Context
app.use(cors);
app.use(authContext);
app.use(infoLogger);

// Routes
app.get("/ping", ping);
app.route("/lens", lensRouter);
app.route("/cron", cronRouter);
app.route("/metadata", metadataRouter);
app.route("/oembed", oembedRouter);
app.route("/og", ogRouter);
app.post("/pageview", rateLimiter({ requests: 10 }), authMiddleware, pageview);
app.post("/posts", rateLimiter({ requests: 10 }), authMiddleware, posts);

app.notFound((ctx) =>
  ctx.json({ error: "Not Found", status: Status.Error }, 404)
);

serve({ fetch: app.fetch, port: 4784 }, (info) => {
  logger.info(`Server running on port ${info.port}`);
});

// Start Discord webhook worker if Redis + webhook envs are configured
if (
  process.env.REDIS_URL &&
  (process.env.EVENTS_DISCORD_WEBHOOK_URL ||
    process.env.PAGEVIEWS_DISCORD_WEBHOOK_URL)
) {
  // Fire and forget
  void startDiscordWebhookWorker();
} else {
  logger.warn("Discord worker not started: missing Redis or webhook envs");
}
