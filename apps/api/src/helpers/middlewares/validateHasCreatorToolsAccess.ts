import { Errors } from "@hey/data/errors";
import { FeatureFlag } from "@hey/data/feature-flags";
import parseJwt from "@hey/helpers/parseJwt";
import type { NextFunction, Request, Response } from "express";
import catchedError from "../catchedError";
import getFeatureFlags from "./getFeatureFlags";

const isCreatorToolsEnabled = (flags: any[]) => {
  const staffToggle = flags.find(
    (toggle: any) => toggle.name === FeatureFlag.CreatorTools
  );
  return staffToggle?.enabled && staffToggle?.variant?.featureEnabled;
};

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
    const flags = await getFeatureFlags(payload.act.sub);

    if (isCreatorToolsEnabled(flags)) {
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateHasCreatorToolsAccess;
