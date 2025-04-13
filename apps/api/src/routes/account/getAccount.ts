import { Errors } from "@hey/data/errors";
import { PermissionId } from "@hey/data/permissions";
import type { Context } from "hono";
import prisma from "src/prisma/client";

const getAccount = async (ctx: Context) => {
  try {
    const { address } = ctx.req.param();

    const accountPermission = await prisma.accountPermission.findFirst({
      where: {
        permissionId: PermissionId.Suspended,
        accountAddress: address
      }
    });

    return ctx.json({
      success: true,
      data: {
        isSuspended: accountPermission?.permissionId === PermissionId.Suspended
      }
    });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default getAccount;
