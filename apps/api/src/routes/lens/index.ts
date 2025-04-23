import { Regex } from "@hey/data/regex";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import authorization from "./authorization";

const app = new Hono();

app.post(
  "/authorization",
  zValidator(
    "json",
    z.object({
      account: z.string().regex(Regex.evmAddress),
      signedBy: z.string().regex(Regex.evmAddress)
    })
  ),
  authorization
);

export default app;
