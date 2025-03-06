import { UNLEASH_API_TOKEN, UNLEASH_API_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { FeatureFlag } from "@hey/data/feature-flags";
import parseJwt from "@hey/helpers/parseJwt";
import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import catchedError from "../catchedError";
import { HEY_USER_AGENT } from "../constants";

const fetchFeatureFlags = async (userId: string) => {
  const { data } = await axios.get(UNLEASH_API_URL, {
    headers: {
      Authorization: UNLEASH_API_TOKEN,
      "User-Agent": HEY_USER_AGENT
    },
    params: {
      appName: "production",
      environment: "production",
      userId
    }
  });

  return data.toggles;
};

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
    const flags = await fetchFeatureFlags(payload.act.sub);

    if (isCreatorToolsEnabled(flags)) {
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateHasCreatorToolsAccess;
