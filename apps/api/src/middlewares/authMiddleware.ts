import { LENS_API_URL } from "@hey/data/constants";
import { withPrefix } from "@hey/helpers/logger";
import type { Context, Next } from "hono";
import { createRemoteJWKSet, jwtVerify } from "jose";

const jwksUri = `${LENS_API_URL.replace("/graphql", "")}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUri), {
  cacheMaxAge: 60 * 60 * 12
});

const unauthorized = (c: Context) => c.body("Unauthorized", 401);

const authMiddleware = async (c: Context, next: Next) => {
  const log = withPrefix("[API]");
  const token = c.get("token");

  if (!token) {
    log.warn("missing token");
    return unauthorized(c);
  }

  try {
    await jwtVerify(token, JWKS);
  } catch {
    log.warn("invalid token");
    return unauthorized(c);
  }

  return next();
};

export default authMiddleware;
