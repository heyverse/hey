import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import rateLimiter from "src/middlewares/rateLimiter";
import { z } from "zod";
import getPreferences from "./getPreferences";
import updatePreferences from "./updatePreferences";

const app = new Hono();

app.get("/get", rateLimiter({ requests: 100 }), getPreferences);
app.post(
  "/update",
  rateLimiter({ requests: 50 }),
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
