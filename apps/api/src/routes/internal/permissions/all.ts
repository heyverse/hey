import prisma from "@hey/db/prisma/db/client";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const permissions = await prisma.permission.findMany({
        include: { _count: { select: { accounts: true } } },
        orderBy: { accounts: { _count: "desc" } }
      });

      return res.status(200).json({ result: permissions, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
