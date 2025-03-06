import { Errors } from "@hey/data/errors";
import type { NextFunction, Request, Response } from "express";
import catchedError from "../catchedError";

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
