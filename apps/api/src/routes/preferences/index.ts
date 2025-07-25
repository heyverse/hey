import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import authMiddleware from "@/middlewares/authMiddleware";
import rateLimiter from "@/middlewares/rateLimiter";
import getPreferences from "./getPreferences";
import updatePreferences from "./updatePreferences";

const app = new Hono();

app.get("/get", rateLimiter({ requests: 100 }), authMiddleware, getPreferences);
app.post(
  "/update",
  rateLimiter({ requests: 50 }),
  authMiddleware,
  zValidator(
    "json",
    z.object({
      appIcon: z.number().optional(),
      includeLowScore: z.boolean().optional()
    })
  ),
  updatePreferences
);

export default app;
