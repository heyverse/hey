import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import rateLimiter from "src/middlewares/rateLimiter";
import { z } from "zod";
import getOembed from "./getOembed";

const app = new Hono();

app.get(
  "/get",
  rateLimiter({ requests: 500 }),
  zValidator("query", z.object({ url: z.string().url() })),
  getOembed
);

export default app;
