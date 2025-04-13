import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import getOembed from "./getOembed";

const app = new Hono();

app.get(
  "/get",
  zValidator("json", z.object({ url: z.string().url() })),
  getOembed
);

export default app;
