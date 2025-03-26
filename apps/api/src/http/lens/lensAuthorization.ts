import { Errors } from "@hey/data/errors";
import { PermissionId } from "@hey/data/permissions";
import type { Request, Response } from "express";
import {
  CACHE_AGE_1_DAY,
  VERIFICATION_ENDPOINT
} from "../../helpers/constants";
import prisma from "../../prisma/client";

export const lensAuthorization = async (req: Request, res: Response) => {
  const { account } = req.body;

  try {
    const suspended = await prisma.accountPermission.findFirst({
      where: { permissionId: PermissionId.Suspended, accountAddress: account }
    });

    return res.setHeader("Cache-Control", CACHE_AGE_1_DAY).json({
      allowed: true,
      sponsored: !suspended?.enabled,
      appVerificationEndpoint: VERIFICATION_ENDPOINT
    });
  } catch {
    return res.json({ error: Errors.SomethingWentWrong });
  }
};
