import type { Context } from "hono";

const ping = (ctx: Context) => {
  return ctx.json({ ping: "pong" });
};

export default ping;
