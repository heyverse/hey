import { serve } from "@hono/node-server";
import "dotenv/config";
import { Status } from "@hey/data/enums";
import { withPrefix } from "@hey/helpers/logger";
import { Hono } from "hono";
import collects from "./collects";
import authContext from "./context/authContext";
import likes from "./likes";
import authMiddleware from "./middlewares/authMiddleware";
import cors from "./middlewares/cors";
import rateLimiter from "./middlewares/rateLimiter";
import posts from "./posts";
import cronRouter from "./routes/cron";
import metadataRouter from "./routes/metadata";
import oembedRouter from "./routes/oembed";
import ogRouter from "./routes/og";
import ping from "./routes/ping";
import startDiscordWebhookWorker from "./workers/discordWebhook";

const log = withPrefix("[API]");

const app = new Hono();

app.use(cors);
app.use(authContext);

app.get("/ping", ping);
app.route("/cron", cronRouter);
app.route("/metadata", metadataRouter);
app.route("/oembed", oembedRouter);
app.route("/og", ogRouter);
app.post("/posts", rateLimiter({ requests: 10 }), authMiddleware, posts);
app.post("/likes", rateLimiter({ requests: 20 }), authMiddleware, likes);
app.post("/collects", rateLimiter({ requests: 20 }), authMiddleware, collects);

app.notFound((ctx) =>
  ctx.json({ error: "Not Found", status: Status.Error }, 404)
);

serve({ fetch: app.fetch, port: 4784 }, (info) => {
  log.info(`Server running on port ${info.port}`);
});

if (
  process.env.REDIS_URL &&
  (process.env.EVENTS_DISCORD_WEBHOOK_URL ||
    process.env.LIKES_DISCORD_WEBHOOK_URL ||
    process.env.COLLECTS_DISCORD_WEBHOOK_URL)
) {
  void startDiscordWebhookWorker();
} else {
  log.warn("Discord worker not started: missing Redis or webhook envs");
}
