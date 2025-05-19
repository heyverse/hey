import type { Context, Next } from "hono";

const secretMiddleware = async (c: Context, next: Next) => {
  const secret = c.req.query("secret");

  if (secret !== process.env.SHARED_SECRET) {
    return c.body("Unauthorized", 401);
  }

  return next();
};

export default secretMiddleware;
