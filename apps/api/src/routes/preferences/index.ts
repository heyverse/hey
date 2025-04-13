import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import getPreferences from "./getPreferences";
import updatePreferences from "./updatePreferences";

const app = new Hono();

app.get("/get", getPreferences);
app.post(
  "/update",
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
