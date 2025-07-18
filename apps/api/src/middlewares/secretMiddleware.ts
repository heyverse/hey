import type { Context, Next } from "hono";

const secretMiddleware = async (c: Context, next: Next) => {
  const code = c.req.query("code");

  if (code !== process.env.SHARED_SECRET) {
    return c.body("Unauthorized", 401);
  }

  return next();
};

export default secretMiddleware;
