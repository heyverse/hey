import { Regex } from "@hey/data/regex";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import getJumperData from "./getJumperData";

const app = new Hono();

app.post(
  "/jumper/get",
  zValidator(
    "json",
    z.object({
      address: z.string().regex(Regex.evmAddress),
      id: z.string()
    })
  ),
  getJumperData
);

export default app;
