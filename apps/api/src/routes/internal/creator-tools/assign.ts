import prisma from "@hey/db/prisma/db/client";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateHasCreatorToolsAccess from "src/helpers/middlewares/validateHasCreatorToolsAccess";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { boolean, object, string } from "zod";
import { postUpdateTasks } from "../permissions/assign";

interface ExtensionRequest {
  enabled: boolean;
  id: string;
  accountAddress: string;
}

const validationSchema = object({
  enabled: boolean(),
  id: string(),
  accountAddress: string()
});

// TODO: Merge this with the one in permissions/assign
export const post = [
  validateLensAccount,
  validateHasCreatorToolsAccess,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { enabled, id, accountAddress } = body as ExtensionRequest;

    try {
      if (enabled) {
        await prisma.accountPermission.create({
          data: { permissionId: id, accountAddress }
        });

        await postUpdateTasks(accountAddress, id);

        return res.status(200).json({ enabled, success: true });
      }

      await prisma.accountPermission.deleteMany({
        where: { permissionId: id as string, accountAddress }
      });

      await postUpdateTasks(accountAddress, id);

      return res.status(200).json({ enabled, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
