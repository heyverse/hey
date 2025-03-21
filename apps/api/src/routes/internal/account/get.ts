import prisma from "@hey/db/prisma/db/client";
import type { Preferences } from "@hey/types/hey";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateHasCreatorToolsAccess from "src/helpers/middlewares/validateHasCreatorToolsAccess";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { noBody } from "src/helpers/responses";

export const get = [
  validateLensAccount,
  validateHasCreatorToolsAccess,
  async (req: Request, res: Response) => {
    const accountAddress = req.query.address as string;

    if (!accountAddress) {
      return noBody(res);
    }

    try {
      const [preference, permissions] = await prisma.$transaction([
        prisma.preference.findUnique({ where: { accountAddress } }),
        prisma.accountPermission.findMany({
          include: { permission: { select: { key: true } } },
          where: { enabled: true, accountAddress }
        })
      ]);

      const response: Preferences = {
        appIcon: preference?.appIcon || 0,
        includeLowScore: Boolean(preference?.includeLowScore),
        permissions: permissions.map(({ permission }) => permission.key)
      };

      return res.status(200).json({ result: response, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
