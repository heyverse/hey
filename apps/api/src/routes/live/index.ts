import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import authMiddleware from "src/middlewares/authMiddleware";
import rateLimiter from "src/middlewares/rateLimiter";
import { z } from "zod";
import createLive from "./createLive";

const app = new Hono();

app.post(
  "/create",
  rateLimiter({ requests: 10 }),
  authMiddleware,
  zValidator("json", z.object({ record: z.boolean() })),
  createLive
);

export default app;
