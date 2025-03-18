import { Errors } from "@hey/data/errors";
import { Access } from "@hey/data/features";
import parseJwt from "@hey/helpers/parseJwt";
import type { NextFunction, Request, Response } from "express";
import { getAddress } from "viem";
import catchedError from "../catchedError";

const handleUnauthorized = (res: Response) => {
  return catchedError(res, new Error(Errors.Unauthorized), 401);
};

const validateIsStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.headers["x-id-token"] as string;
  if (!idToken) {
    return handleUnauthorized(res);
  }

  try {
    const payload = parseJwt(idToken);
    const isStaff = Access["staff"]
      .map((account) => getAddress(account))
      .includes(getAddress(payload.act.sub));

    if (isStaff) {
      return next();
    }

    return handleUnauthorized(res);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateIsStaff;
