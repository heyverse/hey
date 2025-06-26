import parseJwt from "@hey/helpers/parseJwt";
import type { JwtPayload } from "@hey/types/jwt";
import type { Context, Next } from "hono";

const authContext = async (ctx: Context, next: Next) => {
  const token = ctx.req.raw.headers.get("X-Access-Token");
  const payload: JwtPayload = parseJwt(token as string);

  if (!payload.act.sub) {
    ctx.set("account", null);
    ctx.set("token", null);
    return next();
  }

  ctx.set("account", payload.act.sub);
  ctx.set("token", token);
  return next();
};

export default authContext;
