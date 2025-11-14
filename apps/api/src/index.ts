import { serve } from "@hono/node-server";
import "dotenv/config";
import { Status } from "@hey/data/enums";
import { withPrefix } from "@hey/helpers/logger";
import { Hono } from "hono";
import authContext from "./context/authContext";
import cors from "./middlewares/cors";
import ensRouter from "./routes/ens";
import metadataRouter from "./routes/metadata";
import ogRouter from "./routes/og";
import ping from "./routes/ping";

const log = withPrefix("[API]");

const app = new Hono();

app.use(cors);
app.use(authContext);

app.get("/ping", ping);
app.route("/metadata", metadataRouter);
app.route("/og", ogRouter);
app.route("/ens", ensRouter);

app.notFound((ctx) =>
  ctx.json({ error: "Not Found", status: Status.Error }, 404)
);

serve({ fetch: app.fetch, port: 4784 }, (info) => {
  log.info(`Server running on port ${info.port}`);
});
