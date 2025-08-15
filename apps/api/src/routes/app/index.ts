import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "@/middlewares/authMiddleware";
import proMiddleware from "@/middlewares/proMiddleware";
import rateLimiter from "@/middlewares/rateLimiter";
import getStatus from "./getStatus";
import requestApp from "./requestApp";

const app = new Hono();

app.get("/get", rateLimiter({ requests: 100 }), authMiddleware, getStatus);
app.post(
  "/request",
  rateLimiter({ requests: 50 }),
  authMiddleware,
  proMiddleware,
  zValidator("json", z.object({ email: z.string().email() })),
  requestApp
);

export default app;
