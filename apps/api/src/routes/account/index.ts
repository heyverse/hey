import { Regex } from "@hey/data/regex";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import getAccount from "./getAccount";

const app = new Hono();

app.get(
  "/get",
  zValidator("json", z.object({ address: z.string().regex(Regex.evmAddress) })),
  getAccount
);

export default app;
