import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import { generateMediumExpiry, getRedis, setRedis } from "@hey/db/redisClient";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";

const cacheKey = "staff-picks";

const getRandomPicks = (data: any[]) => {
  const random = data.sort(() => Math.random() - Math.random());
  return random.slice(0, 150);
};

export const get = [
  rateLimiter({ requests: 100, within: 1 }),
  async (_: Request, res: Response) => {
    try {
      const cachedResult = await getRedis(cacheKey);

      if (cachedResult) {
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_30_MINS)
          .json({
            result: getRandomPicks(JSON.parse(cachedResult)),
            success: true
          });
      }

      const accountPermission = await prisma.accountPermission.findMany({
        select: { accountAddress: true },
        where: { enabled: true, permissionId: PermissionId.StaffPick }
      });

      await setRedis(cacheKey, accountPermission, generateMediumExpiry());

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .json({ result: getRandomPicks(accountPermission), success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
