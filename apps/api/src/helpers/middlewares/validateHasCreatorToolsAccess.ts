import { Errors } from "@hey/data/errors";
import { Access } from "@hey/data/features";
import parseJwt from "@hey/helpers/parseJwt";
import type { NextFunction, Request, Response } from "express";
import { getAddress } from "viem";
import catchedError from "../catchedError";

const validateHasCreatorToolsAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.headers["x-id-token"] as string;
  if (!idToken) {
    return catchedError(res, new Error(Errors.Unauthorized), 401);
  }

  try {
    const payload = parseJwt(idToken);
    const hasCreatorToolAccess = Access["creator-tools"]
      .map((account) => getAddress(account))
      .includes(getAddress(payload.act.sub));

    if (hasCreatorToolAccess) {
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateHasCreatorToolsAccess;
