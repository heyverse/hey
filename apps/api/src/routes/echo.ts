import type { Context } from "hono";

const echo = async (ctx: Context) => {
  try {
    const body = await ctx.req.json();
    console.info("Echoing body", body);
    return ctx.json({ success: true, body });
  } catch {
    return ctx.json({ success: false, error: "Invalid JSON" }, 400);
  }
};

export default echo;
