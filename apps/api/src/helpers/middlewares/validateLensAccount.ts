import { LENS_API_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import catchedError from "../catchedError";

const jwksUri = `${LENS_API_URL.replace("/graphql", "")}/.well-known/jwks.json`;
// Cache the JWKS for 12 hours
const JWKS = createRemoteJWKSet(new URL(jwksUri), {
  cacheMaxAge: 60 * 60 * 12
});

/**
 * Validate the incoming request is from a valid Lens account.
 *
 * @function validateLensAccount
 * @param {Request} req - The incoming request.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware in the stack.
 * @returns {Promise<void>} Resolves if the request is valid, rejects otherwise.
 * @throws {Error} If the request is not valid, throws an error with the
 *   appropriate HTTP status code.
 */
const validateLensAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.headers["x-id-token"] as string;
  if (!idToken) {
    return catchedError(res, new Error(Errors.Unauthorized), 401);
  }

  try {
    await jwtVerify(idToken, JWKS);
    return next();
  } catch {
    return catchedError(res, new Error(Errors.Unauthorized), 401);
  }
};

export default validateLensAccount;
