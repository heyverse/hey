import { Errors } from "@hey/data/errors";
import type { NextFunction, Request, Response } from "express";
import catchedError from "../catchedError";

/**
 * Validate the incoming request contains the correct secret.
 *
 * @function validateSecret
 * @param {Request} req - The incoming request.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware in the stack.
 * @returns {void} Calls the next middleware if the secret is valid, otherwise
 *   responds with an error.
 * @throws {Error} If there is an issue processing the request, throws an
 *   error with the appropriate HTTP status code.
 */
const validateSecret = (req: Request, res: Response, next: NextFunction) => {
  const { secret } = req.query;

  try {
    if (secret === process.env.SECRET) {
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateSecret;
