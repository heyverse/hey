import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod/v3";
import rateLimiter from "@/middlewares/rateLimiter";
import getOembed from "./getOembed";

const app = new Hono();

app.get(
  "/get",
  rateLimiter({ requests: 500 }),
  zValidator("query", z.object({ url: z.string().url() })),
  getOembed
);

export default app;
