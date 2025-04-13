import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import rateLimiter from "src/middlewares/rateLimiter";
import { z } from "zod";
import getSTS from "./getSTS";

const app = new Hono();

app.get(
  "/sts",
  rateLimiter({ requests: 50 }),
  zValidator("json", z.object({ record: z.boolean() })),
  getSTS
);

export default app;
