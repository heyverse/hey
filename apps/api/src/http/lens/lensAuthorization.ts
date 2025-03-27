import type { Request, Response } from "express";
import {
  CACHE_AGE_1_DAY,
  VERIFICATION_ENDPOINT
} from "../../helpers/constants";

export const lensAuthorization = async (_: Request, res: Response) => {
  return res.setHeader("Cache-Control", CACHE_AGE_1_DAY).json({
    allowed: true,
    sponsored: true,
    appVerificationEndpoint: VERIFICATION_ENDPOINT
  });
};
