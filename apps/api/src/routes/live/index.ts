import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "@/middlewares/authMiddleware";
import rateLimiter from "@/middlewares/rateLimiter";
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
