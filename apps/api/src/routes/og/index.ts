import { Regex } from "@hey/data/regex";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import getAccount from "./getAccount";
import getGroup from "./getGroup";
import getPost from "./getPost";

const app = new Hono();

app.get(
  "/u/:username",
  zValidator("param", z.object({ username: z.string() })),
  getAccount
);

app.get(
  "/posts/:slug",
  zValidator("param", z.object({ slug: z.string() })),
  getPost
);

app.get(
  "/g/:address",
  zValidator(
    "param",
    z.object({ address: z.string().regex(Regex.evmAddress) })
  ),
  getGroup
);

export default app;
