import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
import type { AccountDetails } from "@hey/types/hey";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  async (req: Request, res: Response) => {
    const address = req.query.address as string;

    if (!address) {
      return noBody(res);
    }

    const cacheKey = `account:${address}`;

    try {
      const cachedAccount = await getRedis(cacheKey);

      if (cachedAccount) {
        return res
          .status(200)
          .json({ result: JSON.parse(cachedAccount), success: true });
      }

      const [accountPermission] = await prisma.$transaction([
        prisma.accountPermission.findFirst({
          where: {
            permissionId: PermissionId.Suspended,
            accountAddress: address
          }
        })
      ]);

      const account: AccountDetails = {
        isSuspended: accountPermission?.permissionId === PermissionId.Suspended
      };

      await setRedis(cacheKey, account);

      return res.status(200).json({ result: account, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
