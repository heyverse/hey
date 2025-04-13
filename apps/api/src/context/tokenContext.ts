import parseJwt from "@hey/helpers/parseJwt";
import type { Context, Next } from "hono";

const tokenContext = async (ctx: Context, next: Next) => {
  const token = (ctx.req.raw.headers as any)["x-id-token"];
  const payload = parseJwt(token);

  if (!token) {
    ctx.set("account", null);
    ctx.set("token", null);
    return next();
  }

  ctx.set("account", payload.act.sub);
  ctx.set("token", token);
  return next();
};

export default tokenContext;
