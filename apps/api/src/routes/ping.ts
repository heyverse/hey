import type { Context } from "hono";

const ping = async (ctx: Context) => {
  return ctx.json({ ping: "pong" });
};

export default ping;
