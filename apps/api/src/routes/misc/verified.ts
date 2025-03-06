import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";

const cacheKey = "verified";

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  async (_: Request, res: Response) => {
    try {
      const cachedResult = await getRedis(cacheKey);

      if (cachedResult !== null) {
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_30_MINS)
          .json({ result: cachedResult, success: true });
      }

      const verifiedAccounts = await prisma.accountPermission.findMany({
        select: { accountAddress: true },
        where: {
          enabled: true,
          permissionId: PermissionId.Verified
        }
      });

      const result = verifiedAccounts.map(
        ({ accountAddress }) => accountAddress
      );

      await setRedis(cacheKey, result);

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
