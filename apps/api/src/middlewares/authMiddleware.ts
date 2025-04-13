import { LENS_API_URL } from "@hey/data/constants";
import type { Context, Next } from "hono";
import { createRemoteJWKSet, jwtVerify } from "jose";

const jwksUri = `${LENS_API_URL.replace("/graphql", "")}/.well-known/jwks.json`;
// Cache the JWKS for 12 hours
const JWKS = createRemoteJWKSet(new URL(jwksUri), {
  cacheMaxAge: 60 * 60 * 12
});

const authMiddleware = async (c: Context, next: Next) => {
  const token = c.get("token");

  if (!token) {
    return c.body(null, 401);
  }

  try {
    await jwtVerify(token, JWKS);
  } catch {
    return c.body(null, 401);
  }

  return next();
};

export default authMiddleware;
