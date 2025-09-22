import { Regex } from "@hey/data/regex";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import getAccount from "./getAccount";
import getGroup from "./getGroup";
import getOEmbed from "./getOEmbed";
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
  "/posts/:slug/oembed",
  zValidator("param", z.object({ slug: z.string() })),
  getOEmbed
);

app.get(
  "/g/:address",
  zValidator(
    "param",
    z.object({ address: z.string().regex(Regex.evmAddress) })
  ),
  getGroup
);

app.get(
  "/g/:address/oembed",
  zValidator(
    "param",
    z.object({ address: z.string().regex(Regex.evmAddress) })
  ),
  getOEmbed
);

app.get(
  "/u/:username/oembed",
  zValidator("param", z.object({ username: z.string() })),
  getOEmbed
);

app.get("/oembed", getOEmbed);

export default app;
