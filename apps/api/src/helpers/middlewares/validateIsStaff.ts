import { Errors } from "@hey/data/errors";
import { FeatureFlag } from "@hey/data/feature-flags";
import parseJwt from "@hey/helpers/parseJwt";
import type { NextFunction, Request, Response } from "express";
import catchedError from "../catchedError";
import getFeatureFlags from "./getFeatureFlags";

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
    const flags = await getFeatureFlags(payload.act.sub);
    const staffToggle = flags.find(
      (toggle: any) => toggle.name === FeatureFlag.Staff
    );

    if (staffToggle?.enabled && staffToggle?.variant?.featureEnabled) {
      return next();
    }

    return handleUnauthorized(res);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateIsStaff;
