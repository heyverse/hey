import { Regex } from "@hey/data/regex";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import authMiddleware from "src/middlewares/authMiddleware";
import staffAccessMiddleware from "src/middlewares/staffAccessMiddleware";
import { z } from "zod";
import assignPermission from "./assignPermission";

const app = new Hono();

app.post(
  "/assign",
  authMiddleware,
  staffAccessMiddleware,
  zValidator(
    "json",
    z.object({
      account: z.string().regex(Regex.evmAddress),
      permission: z.string(),
      enabled: z.boolean()
    })
  ),
  assignPermission
);

export default app;
