import { Errors } from "@hey/data/errors";
import { PermissionId } from "@hey/data/permissions";
import type { Context } from "hono";
import prisma from "src/prisma/client";

const getAccount = async (ctx: Context) => {
  try {
    const { address } = await ctx.req.json();

    const accountPermission = await prisma.accountPermission.findFirst({
      where: {
        permissionId: PermissionId.Suspended,
        accountAddress: address
      }
    });

    return ctx.json({
      isSuspended: accountPermission?.permissionId === PermissionId.Suspended
    });
  } catch {
    return ctx.json({ error: Errors.SomethingWentWrong }, 500);
  }
};

export default getAccount;
