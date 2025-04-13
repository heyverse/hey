import { Regex } from "@hey/data/regex";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import authMiddleware from "src/middlewares/authMiddleware";
import staffAccessMiddleware from "src/middlewares/staffAccessMiddleware";
import { z } from "zod";
import getAccount from "./getAccount";

const app = new Hono();

app.get(
  "/get",
  authMiddleware,
  staffAccessMiddleware,
  zValidator("json", z.object({ address: z.string().regex(Regex.evmAddress) })),
  getAccount
);

export default app;
