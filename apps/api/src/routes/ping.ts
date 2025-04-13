import type { Context } from "hono";

const ping = async (ctx: Context) => {
  return ctx.json({ success: true, data: { ping: "pong" } });
};

export default ping;
